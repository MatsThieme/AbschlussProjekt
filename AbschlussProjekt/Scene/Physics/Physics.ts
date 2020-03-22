import { awaitPromises } from '../../Helpers.js';
import { CircleCollider } from '../GameObject/Components/CircleCollider.js';
import { ComponentType } from '../GameObject/Components/ComponentType.js';
import { PolygonCollider } from '../GameObject/Components/PolygonCollider.js';
import { GameObject } from '../GameObject/GameObject.js';
import { Vector2 } from '../Vector2.js';
import { AABB } from './AABB.js';
import { Collision } from './Collision.js';
import { AsyncWorker } from '../Worker/AsyncWorker.js';
import { Settings } from '../Settings.js';

export class Physics {
    public static gravity: Vector2 = new Vector2(0, -0.00001);
    public static timeScale: number = 0.1;
    private static ignoreCollisions: number[][] = [];
    public static ignoreCollision(gameObject1: GameObject, gameObject2: GameObject, collide: boolean = false): void {
        const pair = gameObject1.id > gameObject2.id ? [gameObject1.id, gameObject2.id] : [gameObject2.id, gameObject1.id];
        if (!collide) {
            if (this.ignoreCollisions.indexOf(pair) === -1) Physics.ignoreCollisions.push(pair);
            return;
        }

        const x = Physics.ignoreCollisions.findIndex(ids => JSON.stringify(ids) === JSON.stringify(pair));
        if (x !== -1) Physics.ignoreCollisions.splice(x, 1);
    }
    public static async collision(first: GameObject, second: GameObject): Promise<Collision[]> {
        if (!first.active || !second.active || first.id === second.id || first.rigidbody.mass === 0 && second.rigidbody.mass === 0 || Physics.ignoreCollisions.findIndex(ids => JSON.stringify(ids) === JSON.stringify(first.id > second.id ? [first.id, second.id] : [second.id, first.id])) !== -1) return [];

        const promises: Promise<Collision>[] = [];

        for (const collider of first.collider) {

            if (collider.type === ComponentType.CircleCollider) {

                for (const otherCollider of second.collider) {
                    if (!AABB.intersects(collider, otherCollider) || collider.id === otherCollider.id) continue;

                    if (otherCollider.type === ComponentType.CircleCollider) {
                        promises.push(Physics.collisionCircle(<CircleCollider>collider, <CircleCollider>otherCollider));
                    } else if (otherCollider.type === ComponentType.PolygonCollider) {
                        promises.push(Physics.collisionPolygonCircle(<PolygonCollider>otherCollider, <CircleCollider>collider));
                    }

                }

            } else if (collider.type === ComponentType.PolygonCollider) {

                for (const otherCollider of second.collider) {
                    if (!AABB.intersects(collider, otherCollider) || collider.id === otherCollider.id) continue;

                    if (otherCollider.type === ComponentType.PolygonCollider) {
                        promises.push(Physics.collisionPolygon(<PolygonCollider>collider, <PolygonCollider>otherCollider));
                    } else if (otherCollider.type === ComponentType.CircleCollider) {
                        promises.push(Physics.collisionPolygonCircle(<PolygonCollider>collider, <CircleCollider>otherCollider));
                    }
                }

            }

        }

        return promises.length === 0 ? [] : (await awaitPromises(...promises)).filter(c => c.normal);
    }
    public static async collisionCircle(circleCollider1: CircleCollider, circleCollider2: CircleCollider): Promise<Collision> {
        const gO1 = circleCollider1.gameObject;
        const gO2 = circleCollider2.gameObject;

        if (!circleCollider1.intersects(circleCollider2)) return new Collision(circleCollider1, circleCollider2);

        let penetration: number;
        let normal: Vector2;

        const AtoB = gO2.transform.position.sub(gO1.transform.position);

        if (AtoB.magnitude != 0) {
            penetration = circleCollider1.radius + circleCollider2.radius - AtoB.magnitude;
            normal = AtoB.normalized;
        } else {
            penetration = Math.max(circleCollider1.radius, circleCollider2.radius);
            normal = new Vector2(0, 1);
        }

        return new Collision(circleCollider1, circleCollider2, normal, penetration);
    }
    public static async collisionPolygon(A: PolygonCollider, B: PolygonCollider): Promise<Collision> {
        let leastPenetration: number = Infinity;
        let incidentCollider!: PolygonCollider;
        let referenceCollider!: PolygonCollider;
        let leastPenetrationNormal!: Vector2;
        let leastDistance: number = Infinity;

        for (let i = 0; i < A.faces.length; i++) {
            const aP = A.project(A.faces[i].normal);
            const bP = B.project(A.faces[i].normal);

            const overlap = Math.min(aP.max, bP.max) - Math.max(aP.min, bP.min);

            if (overlap < 0) {
                return new Collision(A, B);
            } else if (overlap < leastPenetration) {
                leastPenetration = overlap;
                leastPenetrationNormal = A.faces[i].normal.normalized;
                referenceCollider = A;
                incidentCollider = B;
                leastDistance = A.faces[i].normal.normalized.add(referenceCollider.position).distance(incidentCollider.position);
            } else if (overlap === leastPenetration && A.faces[i].normal.normalized.equal(leastPenetrationNormal.flipped)) {
                const distance = A.faces[i].normal.normalized.add(referenceCollider.position).distance(incidentCollider.position);

                if (distance < leastDistance) {
                    leastDistance = distance;
                    leastPenetration = overlap;
                    leastPenetrationNormal = A.faces[i].normal.normalized;
                    referenceCollider = A;
                    incidentCollider = B;
                }
            }
        }

        for (let i = 0; i < B.faces.length; i++) {
            const aP = A.project(B.faces[i].normal);
            const bP = B.project(B.faces[i].normal);

            const overlap = Math.min(aP.max, bP.max) - Math.max(aP.min, bP.min);

            if (overlap < 0) {
                return new Collision(A, B);
            } else if (overlap < leastPenetration) {
                leastPenetration = overlap;
                leastPenetrationNormal = B.faces[i].normal.normalized;
                referenceCollider = B;
                incidentCollider = A;
                leastDistance = B.faces[i].normal.normalized.add(referenceCollider.position).distance(incidentCollider.position);
            } else if (overlap === leastPenetration && B.faces[i].normal.normalized.equal(leastPenetrationNormal.flipped)) {
                const distance = B.faces[i].normal.normalized.add(referenceCollider.position).distance(incidentCollider.position);

                if (distance < leastDistance) {
                    leastDistance = distance;
                    leastPenetration = overlap;
                    leastPenetrationNormal = B.faces[i].normal.normalized;
                    referenceCollider = B;
                    incidentCollider = A;
                }
            }
        }



        const contacts: Vector2[] = [];

        for (const faceA of A.faces) {
            for (const faceB of B.faces) {
                const contact = faceA.line.intersects(faceB.line);
                if (contact) contacts.push(contact);
            }
        }


        //const r: { contacts: { x: number, y: number }[], penetrationDepth: number, normal: { x: number, y: number } } | undefined = await AsyncWorker.work(Settings.appPath + '/Scene/Physics/PolygonCollisionWorker.js', { A: A.vertices, B: B.vertices });
        //if (!r) return new Collision(A, B);
        //const { contacts, penetrationDepth, normal } = r;
        //debugger;

        //return new Collision(A, B, new Vector2(normal.x, normal.y), penetrationDepth, contacts.map(c => new Vector2(c.x, c.y)));


        return new Collision(A, B, leastPenetrationNormal, leastPenetration, contacts);
    }
    public static async collisionPolygonCircle(polygonCollider: PolygonCollider, circleCollider: CircleCollider): Promise<Collision> {
        return new Collision(polygonCollider, circleCollider);
    }
}
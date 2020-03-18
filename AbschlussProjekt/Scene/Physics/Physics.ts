import { CircleCollider } from '../GameObject/Components/CircleCollider.js';
import { Collider } from '../GameObject/Components/Collider.js';
import { ComponentType } from '../GameObject/Components/ComponentType.js';
import { PolygonCollider } from '../GameObject/Components/PolygonCollider.js';
import { GameObject } from '../GameObject/GameObject.js';
import { Vector2 } from '../Vector2.js';
import { AABB } from './AABB.js';
import { Collision } from './Collision.js';

export class Physics {
    public static gravity: Vector2 = new Vector2(0, -9.807 / 100 / 1000);
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
    public static async asyncCollision(first: GameObject, second: GameObject): Promise<Collision[]> {
        //const r = await AsyncWorker.work<Collision[]>('Physics/PhysicsWorker.js');
        return Physics.collision(first, second);
    }
    public static collision(first: GameObject, second: GameObject): Collision[] {
        const ret: Collision[] = [];

        if (first.id === second.id || first.rigidbody.mass === 0 && second.rigidbody.mass === 0 || Physics.ignoreCollisions.findIndex(ids => JSON.stringify(ids) === JSON.stringify(first.id > second.id ? [first.id, second.id] : [second.id, first.id])) !== -1) return ret;

        for (const collider of first.getComponents<Collider>(ComponentType.Collider)) {

            if (collider.type === ComponentType.CircleCollider) {

                for (const otherCollider of second.getComponents<Collider>(ComponentType.Collider)) {
                    if (!AABB.intersects(collider, otherCollider) || collider.id === otherCollider.id) continue;

                    if (otherCollider.type === ComponentType.CircleCollider) {
                        const c = Physics.collisionCircle(<CircleCollider>collider, <CircleCollider>otherCollider);
                        if (c.normal) ret.push(c);
                    } else if (otherCollider.type === ComponentType.PolygonCollider) {
                        const c = Physics.collisionPolygonCircle(<PolygonCollider>otherCollider, <CircleCollider>collider);
                        if (c.normal) ret.push(c);
                    }

                }

            } else if (collider.type === ComponentType.PolygonCollider) {

                for (const otherCollider of second.getComponents<Collider>(ComponentType.Collider)) {
                    if (!AABB.intersects(collider, otherCollider) || collider.id === otherCollider.id) continue;

                    if (otherCollider.type === ComponentType.PolygonCollider) {
                        const c = Physics.collisionPolygon(<PolygonCollider>collider, <PolygonCollider>otherCollider);
                        if (c.normal) ret.push(c);
                    } else if (otherCollider.type === ComponentType.CircleCollider) {
                        const c = Physics.collisionPolygonCircle(<PolygonCollider>collider, <CircleCollider>otherCollider);
                        if (c.normal) ret.push(c);
                    }
                }

            }

        }

        return ret;
    }
    public static circleIntersection(circleCollider1: CircleCollider, circleCollider2: CircleCollider): boolean {
        return circleCollider2.gameObject.transform.position.sub(circleCollider1.gameObject.transform.position).magnitudeSquared < (circleCollider1.radius + circleCollider2.radius) ** 2;
    }
    public static collisionCircle(circleCollider1: CircleCollider, circleCollider2: CircleCollider): Collision {
        const gO1 = circleCollider1.gameObject;
        const gO2 = circleCollider2.gameObject;

        if (!Physics.circleIntersection(circleCollider1, circleCollider2)) return new Collision(circleCollider1, circleCollider2);

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
    public static collisionPolygon(A: PolygonCollider, B: PolygonCollider): Collision {
        let leastPenetration: number = Infinity;
        let referenceIndex!: number;
        let incidentCollider!: PolygonCollider;
        let referenceCollider!: PolygonCollider;
        let log!: any;

        for (let i = 0; i < A.faces.length; i++) {
            const aP = A.project(A.faces[i].normal);
            const bP = B.project(A.faces[i].normal);

            const overlap = Math.min(aP.max, bP.max) - Math.max(aP.min, bP.min);

            if (overlap < 0) {
                return new Collision(A, B);
            } else {
                if (overlap <= leastPenetration) {
                    leastPenetration = overlap;
                    referenceIndex = i;
                    referenceCollider = A;
                    incidentCollider = B;
                    log = 'A';
                }
            }
        }

        for (let i = 0; i < B.faces.length; i++) {
            const aP = A.project(B.faces[i].normal);
            const bP = B.project(B.faces[i].normal);

            const overlap = Math.min(aP.max, bP.max) - Math.max(aP.min, bP.min);

            if (overlap < 0) {
                return new Collision(A, B);
            } else {
                if (overlap < leastPenetration) {
                    leastPenetration = overlap;
                    referenceIndex = i;
                    referenceCollider = B;
                    incidentCollider = A;
                    log = 'B';
                }
            }
        }

        //console.log(log);

        const leastPenetrationNormal = referenceCollider.faces[referenceIndex].normal.normalized;

        if (leastPenetrationNormal.perpendicularCounterClockwise.add(referenceCollider.position).angleTo(referenceCollider.position, incidentCollider.position).degree > 180) leastPenetrationNormal.flip();

        const contacts: Vector2[] = [];

        for (const faceA of A.faces) {
            for (const faceB of B.faces) {
                const contact = faceA.line.intersects(faceB.line);
                if (contact) contacts.push(contact);
            }
        }

        //console.log('colliding');

        return new Collision(A, B, leastPenetrationNormal, leastPenetration, contacts);
    }
    public static collisionPolygonCircle(polygonCollider: PolygonCollider, circleCollider: CircleCollider): Collision {
        const contacts = [];

        for (const v of polygonCollider.vertices) {
            if (circleCollider.position.distance(v) < circleCollider.radius) contacts.push(v);
        }

        if (contacts.length === 0) return new Collision(polygonCollider, circleCollider);
        else return new Collision(polygonCollider, circleCollider, Vector2.average(...contacts).sub(circleCollider.position).normalize(), Vector2.average(...contacts).distance(circleCollider.position), contacts);
    }
}
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
    public static gravity: Vector2 = new Vector2(0, -0.01);
    public static timeScale: number = 1;
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

        let aP;

        try {
            aP = await awaitPromises(...promises);
        } catch{
            console.log('auch zu lahm');
        }

        return promises.length === 0 ? [] : (aP || []).filter(c => c.normal);
    }
    public static async collisionCircle(A: CircleCollider, B: CircleCollider): Promise<Collision> {
        if (!A.intersects(B)) return new Collision(A, B);

        //const AB = B.position.sub(A.position);
        //const penetrationDepth = AB.magnitude != 0 ? A.radius + B.radius - AB.magnitude : Math.max(A.radius, B.radius);
        //const normal = AB.magnitude != 0 ? AB.normalized : new Vector2(1, 0);

        //const contacts = [normal.clone.setLength(A.radius - penetrationDepth / 2 * (A.radius / B.radius)).add(A.position)];
        //return new Collision(A, B, normal, penetrationDepth, contacts);

        try {
            const { contacts, penetrationDepth, normal } = await AsyncWorker.task(Settings.appPath + '/Scene/Physics/CollisionWorker.js', { name: 'c', data: { A: { position: A.position, radius: A.radius }, B: { position: B.position, radius: B.radius } } });
            return new Collision(A, B, new Vector2(normal.x, normal.y), penetrationDepth, contacts.map((c: Vector2) => new Vector2(c.x, c.y)));
        } catch {
            return new Collision(A, B);
        }
    }
    public static async collisionPolygon(A: PolygonCollider, B: PolygonCollider): Promise<Collision> {
        //let leastPenetration: number = Infinity;
        //let incidentCollider!: PolygonCollider;
        //let referenceCollider!: PolygonCollider;
        //let leastPenetrationNormal!: Vector2;

        //for (let i = 0; i < A.faces.length; i++) {
        //    const aP = A.project(A.faces[i].normal);
        //    const bP = B.project(A.faces[i].normal);

        //    const overlap = Math.min(aP.max, bP.max) - Math.max(aP.min, bP.min);

        //    if (overlap < 0) {
        //        return new Collision(A, B);
        //    } else if (overlap < leastPenetration) {
        //        leastPenetration = overlap;
        //        leastPenetrationNormal = A.faces[i].normal.normalized;
        //        referenceCollider = A;
        //        incidentCollider = B;
        //    }
        //}

        //for (let i = 0; i < B.faces.length; i++) {
        //    const aP = A.project(B.faces[i].normal);
        //    const bP = B.project(B.faces[i].normal);

        //    const overlap = Math.min(aP.max, bP.max) - Math.max(aP.min, bP.min);

        //    if (overlap < 0) {
        //        return new Collision(A, B);
        //    } else if (overlap < leastPenetration) {
        //        leastPenetration = overlap;
        //        leastPenetrationNormal = B.faces[i].normal.normalized;
        //        referenceCollider = B;
        //        incidentCollider = A;
        //    }
        //}

        //const contacts: Vector2[] = [];

        //for (const faceA of A.faces) {
        //    for (const faceB of B.faces) {
        //        const contact = faceA.line.intersects(faceB.line);
        //        if (contact) contacts.push(contact);
        //    }
        //}


        //return new Collision(A, B, leastPenetrationNormal, leastPenetration, contacts);


        // collision calculations in worker thread
        try {
            const { contacts, penetrationDepth, normal } = await AsyncWorker.task(Settings.appPath + '/Scene/Physics/CollisionWorker.js', { name: 'p', data: { A: A.vertices, B: B.vertices } });
            return new Collision(A, B, new Vector2(normal.x, normal.y), penetrationDepth, contacts.map((c: Vector2) => new Vector2(c.x, c.y)));
        } catch {
            return new Collision(A, B);
        }
    }
    public static async collisionPolygonCircle(polygonCollider: PolygonCollider, circleCollider: CircleCollider): Promise<Collision> {
        //const contacts: Vector2[] = [];

        //for (const face of polygonCollider.faces) {
        //    contacts.push(...face.line.intersectsCircle(circleCollider.position, circleCollider.radius));
        //}

        //if (contacts.length === 0) return new Collision(circleCollider, polygonCollider);

        //const normal = polygonCollider.position.sub(circleCollider.position).normalize();

        //const penetrationDepth = circleCollider.radius - Vector2.average(...contacts).distance(circleCollider.position);


        //return new Collision(circleCollider, polygonCollider, normal, penetrationDepth, contacts);

        try {
            const { contacts, penetrationDepth, normal } = await AsyncWorker.task(Settings.appPath + '/Scene/Physics/CollisionWorker.js', { name: 'pc', data: { A: polygonCollider.vertices, B: { position: circleCollider.position, radius: circleCollider.radius } } });
            return new Collision(polygonCollider, circleCollider, new Vector2(normal.x, normal.y), penetrationDepth, contacts.map((c: Vector2) => new Vector2(c.x, c.y)));
        } catch {
            return new Collision(polygonCollider, circleCollider);
        }
    }
}
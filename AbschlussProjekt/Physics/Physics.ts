import { CircleCollider } from '../Components/CircleCollider.js';
import { Collider } from '../Components/Collider.js';
import { ComponentType } from '../Components/ComponentType.js';
import { PolygonCollider } from '../Components/PolygonCollider.js';
import { GameObject } from '../GameObject.js';
import { Vector2 } from '../Vector2.js';
import { AABB } from './AABB.js';
import { Collision } from './Collision.js';

export class Physics {
    public static gravity: Vector2 = new Vector2(0, -9.807 / 100 / 1000);
    public static timeScale: number = 1;
    private static ignoreCollisions: number[][] = [];
    public static ignoreCollision(gameObject1: GameObject, gameObject2: GameObject, collide: boolean = false): void {
        const pair = gameObject1.id > gameObject2.id ? [gameObject1.id, gameObject2.id] : [gameObject2.id, gameObject1.id];
        if (!collide) {
            Physics.ignoreCollisions.push(pair);
            return;
        }

        const x = Physics.ignoreCollisions.findIndex(ids => JSON.stringify(ids) === JSON.stringify(pair));
        if (x !== -1) Physics.ignoreCollisions.splice(x, 1);
    }
    public static async  asyncCollision(first: GameObject, second: GameObject): Promise<Collision[]> {
        //first.scene = <any>undefined;
        //second.scene = <any>undefined;
        //return await AsyncWorker.work('Physics/PhysicsWorker.js', { name: 'collision', parameters: [first, second] });
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

                    if (collider.type === ComponentType.PolygonCollider) {
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
            normal = AtoB.normalized; // test with gos swapped
        } else {
            penetration = Math.max(circleCollider1.radius, circleCollider2.radius);
            normal = new Vector2(0, 1);
        }

        return new Collision(circleCollider1, circleCollider2, normal, penetration);
    }
    public static collisionPolygon(A: PolygonCollider, B: PolygonCollider): Collision {
        let leastPenetrationNormal!: Vector2;
        let leastPenetration: number = Infinity;

        for (const normal of [...A.normals, ...B.normals]) {
            const aP = A.project(normal);
            const bP = B.project(normal);

            const overlap = Math.min(aP.y, bP.y) - Math.max(aP.x, bP.x);

            if (overlap <= 0) {
                console.log('not colliding');
                return new Collision(A, B);
            } else {
                if (overlap < leastPenetration) {
                    leastPenetration = overlap;
                    leastPenetrationNormal = normal;
                }
            }
        }
        console.log('colliding');

        const center = Vector2.average(...A.vertices, ...B.vertices);

        return new Collision(A, B, leastPenetrationNormal, leastPenetration, Vector2.orderByDistanceAsc(center, ...A.vertices, ...B.vertices).filter((v, i, a) => v.distance(center) === a[0].distance(center)));
    }
    public static collisionPolygonCircle(polygonCollider: PolygonCollider, circleCollider: CircleCollider): Collision {
        return new Collision(polygonCollider, circleCollider);
    }
}
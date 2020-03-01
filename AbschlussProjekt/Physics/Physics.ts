import { BoxCollider } from '../Components/BoxCollider.js';
import { CapsuleCollider } from '../Components/CapsuleCollider.js';
import { CircleCollider } from '../Components/CircleCollider.js';
import { GameObject } from '../GameObject.js';
import { Collider } from './Collider.js';
import { Collision } from './Collision.js';
import { Vector2 } from '../Vector2.js';
import { AABB } from './AABB.js';

export class Physics {
    [key: string]: any;
    public static gravity: Vector2 = new Vector2(0, 9.807);
    public static timeScale: number = 1;
    public static collision(first: GameObject, second: GameObject): Collision {
        let collision: Collision = new Collision(first, second);

        if (first.id === second.id) return collision;


        for (const collider of first.getComponents(Collider)) {
            if (collider instanceof CircleCollider) {

                for (const otherCollider of second.getComponents(Collider)) {
                    if (!AABB.intersects(collider, otherCollider)) continue;

                    if (otherCollider instanceof CircleCollider) {

                    } else if (otherCollider instanceof BoxCollider) {

                    } else if (otherCollider instanceof CapsuleCollider) {

                    }
                }

            } else if (collider instanceof BoxCollider) {

                for (const otherCollider of second.getComponents(Collider)) {
                    if (!AABB.intersects(collider, otherCollider)) continue;

                    if (otherCollider instanceof CircleCollider) {

                    } else if (otherCollider instanceof BoxCollider) {

                    } else if (otherCollider instanceof CapsuleCollider) {

                    }
                }

            } else if (collider instanceof CapsuleCollider) {

                for (const otherCollider of second.getComponents(Collider)) {
                    if (!AABB.intersects(collider, otherCollider)) continue;

                    if (otherCollider instanceof CircleCollider) {

                    } else if (otherCollider instanceof BoxCollider) {

                    } else if (otherCollider instanceof CapsuleCollider) {

                    }
                }

            }
        }

        return collision;
    }
    public static intersectsCircle(circleCollider1: CircleCollider, circleCollider2: CircleCollider): boolean {
        return circleCollider2.gameObject.transform.position.sub(circleCollider1.gameObject.transform.position).magnitudeSquared < (circleCollider1.radius + circleCollider2.radius) ** 2;
    }
    public static CircleVsCircle(circleCollider1: CircleCollider, circleCollider2: CircleCollider): Collision {
        if (!Physics.intersectsCircle(circleCollider1, circleCollider2)) return new Collision(circleCollider1.gameObject, circleCollider2.gameObject);

        const gO1 = circleCollider1.gameObject;
        const gO2 = circleCollider2.gameObject;

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

        return new Collision(circleCollider1.gameObject, circleCollider2.gameObject, normal, penetration);
    }
    public static AABBVsAABB(boxCollider1: BoxCollider, boxCollider2: BoxCollider): Collision {
        if (!AABB.intersects(boxCollider1, boxCollider2)) return new Collision(boxCollider1.gameObject, boxCollider2.gameObject);

        const gO1 = boxCollider1.gameObject;
        const gO2 = boxCollider1.gameObject;

        let penetration: number;
        let normal: Vector2;

        const AtoB = gO2.transform.position.sub(gO1.transform.position);

        let x_overlap = boxCollider1.AABB.size.x / 2 + boxCollider2.AABB.size.x / 2 - Math.abs(AtoB.x);
        let y_overlap = boxCollider2.AABB.size.y / 2 + boxCollider2.AABB.size.y / 2 - Math.abs(AtoB.y);

        if (x_overlap > y_overlap) {
            normal = new Vector2(0, AtoB.x < 0 ? -1 : 1);
            penetration = x_overlap;
        } else {
            normal = new Vector2(0, AtoB.y < 0 ? -1 : 1);
            penetration = y_overlap;
        }

        return new Collision(boxCollider1.gameObject, boxCollider2.gameObject, normal, penetration);
    }
}
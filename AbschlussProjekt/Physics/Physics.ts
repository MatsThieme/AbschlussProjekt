import { BoxCollider } from '../Components/BoxCollider.js';
import { CapsuleCollider } from '../Components/CapsuleCollider.js';
import { CircleCollider } from '../Components/CircleCollider.js';
import { GameObject } from '../GameObject.js';
import { Collider } from './Collider.js';
import { Collision } from './Collision.js';
import { Vector2 } from '../Vector2.js';

export class Physics {
    public static collision(first: GameObject, second: GameObject): Collision {
        let collision: Collision = new Collision(first, second);


        for (const collider of first.getComponents(Collider)) {
            if (collider instanceof CircleCollider) {

                for (const otherCollider of second.getComponents(Collider)) {
                    if (otherCollider instanceof CircleCollider) {
                        collision.contactPoints.push(...Physics.collisionCircleCircle(collider, otherCollider));
                    } else if (otherCollider instanceof BoxCollider) {
                        collision.contactPoints.push(...Physics.collisionBoxCircle(otherCollider, collider));
                    } else if (otherCollider instanceof CapsuleCollider) {
                        collision.contactPoints.push(...Physics.collisionCircleCapsule(collider, otherCollider));
                    }
                }

            } else if (collider instanceof BoxCollider) {

                for (const otherCollider of second.getComponents(Collider)) {
                    if (otherCollider instanceof CircleCollider) {
                        collision.contactPoints.push(...Physics.collisionBoxCircle(collider, otherCollider));
                    } else if (otherCollider instanceof BoxCollider) {
                        collision.contactPoints.push(...Physics.collisionBoxBox(collider, otherCollider));
                    } else if (otherCollider instanceof CapsuleCollider) {
                        collision.contactPoints.push(...Physics.collisionBoxCapsule(collider, otherCollider));
                    }
                }

            } else if (collider instanceof CapsuleCollider) {

                for (const otherCollider of second.getComponents(Collider)) {
                    if (otherCollider instanceof CircleCollider) {
                        collision.contactPoints.push(...Physics.collisionCircleCapsule(otherCollider, collider));
                    } else if (otherCollider instanceof BoxCollider) {
                        collision.contactPoints.push(...Physics.collisionBoxCapsule(otherCollider, collider));
                    } else if (otherCollider instanceof CapsuleCollider) {
                        collision.contactPoints.push(...Physics.collisionCapsuleCapsule(collider, otherCollider));
                    }
                }

            }
        }

        return collision;
    }
    public static collisionBoxBox(collider1: BoxCollider, collider2: BoxCollider): Vector2[] {

        return [];
    }
    public static collisionCircleCircle(collider1: CircleCollider, collider2: CircleCollider): Vector2[] {

        return [];
    }
    public static collisionCapsuleCapsule(collider1: CapsuleCollider, collider2: CapsuleCollider): Vector2[] {

        return [];
    }

    public static collisionBoxCircle(collider1: BoxCollider, collider2: CircleCollider): Vector2[] {

        return [];
    }
    public static collisionBoxCapsule(collider1: BoxCollider, collider2: CapsuleCollider): Vector2[] {

        return [];
    }
    public static collisionCircleCapsule(collider1: CircleCollider, collider2: CapsuleCollider): Vector2[] {

        return [];
    }
    public static calculateThings(collision: Collision) {

    }
}
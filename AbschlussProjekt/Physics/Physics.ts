import { Collider } from './Collider.js';
import { Collision } from './Collision.js';
import { ColliderType } from './ColliderType.js';
import { BoxCollider } from '../Components/BoxCollider.js';

export class Physics {
    public static collision(collider1: Collider, collider2: Collider): Collision {
        let collision: Collision;

        if (collider1.colliderType === ColliderType.Box) {
            if (collider2.colliderType === ColliderType.Box) {

            } else if (collider2.colliderType === ColliderType.Circle) {

            } else if (collider2.colliderType === ColliderType.Capsule) {

            }
        } else if (collider1.colliderType === ColliderType.Circle) {
            if (collider2.colliderType === ColliderType.Box) {

            } else if (collider2.colliderType === ColliderType.Circle) {

            } else if (collider2.colliderType === ColliderType.Capsule) {

            }
        } else if (collider1.colliderType === ColliderType.Capsule) {
            if (collider2.colliderType === ColliderType.Box) {

            } else if (collider2.colliderType === ColliderType.Circle) {

            } else if (collider2.colliderType === ColliderType.Capsule) {

            }
        }

        return new Collision(collider1.gameObject, collider2.gameObject);
    }
    public static collisionBoxBox(collider1: BoxCollider, collider2: BoxCollider): Collision {
        const collision = new Collision(collider1.gameObject, collider2.gameObject);

        //if (collider1.)

        return new Collision(collider1.gameObject, collider2.gameObject);
    }
}
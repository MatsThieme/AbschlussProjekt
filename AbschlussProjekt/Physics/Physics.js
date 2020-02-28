import { Collision } from './Collision.js';
import { ColliderType } from './ColliderType.js';
export class Physics {
    static collision(collider1, collider2) {
        let collision;
        if (collider1.colliderType === ColliderType.Box) {
            if (collider2.colliderType === ColliderType.Box) {
            }
            else if (collider2.colliderType === ColliderType.Circle) {
            }
            else if (collider2.colliderType === ColliderType.Capsule) {
            }
        }
        else if (collider1.colliderType === ColliderType.Circle) {
            if (collider2.colliderType === ColliderType.Box) {
            }
            else if (collider2.colliderType === ColliderType.Circle) {
            }
            else if (collider2.colliderType === ColliderType.Capsule) {
            }
        }
        else if (collider1.colliderType === ColliderType.Capsule) {
            if (collider2.colliderType === ColliderType.Box) {
            }
            else if (collider2.colliderType === ColliderType.Circle) {
            }
            else if (collider2.colliderType === ColliderType.Capsule) {
            }
        }
        return new Collision(collider1.gameObject, collider2.gameObject);
    }
    static collisionBoxBox(collider1, collider2) {
        const collision = new Collision(collider1.gameObject, collider2.gameObject);
        //if (collider1.)
        return new Collision(collider1.gameObject, collider2.gameObject);
    }
}

import { Collision } from './Collision.js';
import { ColliderType } from './ColliderType.js';
var Physics = /** @class */ (function () {
    function Physics() {
    }
    Physics.collision = function (collider1, collider2) {
        var collision;
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
    };
    Physics.collisionBoxBox = function (collider1, collider2) {
        var collision = new Collision(collider1.gameObject, collider2.gameObject);
        //if (collider1.)
        return new Collision(collider1.gameObject, collider2.gameObject);
    };
    return Physics;
}());
export { Physics };

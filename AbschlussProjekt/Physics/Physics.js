"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collision_js_1 = require("./Collision.js");
const ColliderType_js_1 = require("./ColliderType.js");
class Physics {
    static collision(collider1, collider2) {
        let collision;
        if (collider1.colliderType === ColliderType_js_1.ColliderType.Box) {
            if (collider2.colliderType === ColliderType_js_1.ColliderType.Box) {
            }
            else if (collider2.colliderType === ColliderType_js_1.ColliderType.Circle) {
            }
            else if (collider2.colliderType === ColliderType_js_1.ColliderType.Capsule) {
            }
        }
        else if (collider1.colliderType === ColliderType_js_1.ColliderType.Circle) {
            if (collider2.colliderType === ColliderType_js_1.ColliderType.Box) {
            }
            else if (collider2.colliderType === ColliderType_js_1.ColliderType.Circle) {
            }
            else if (collider2.colliderType === ColliderType_js_1.ColliderType.Capsule) {
            }
        }
        else if (collider1.colliderType === ColliderType_js_1.ColliderType.Capsule) {
            if (collider2.colliderType === ColliderType_js_1.ColliderType.Box) {
            }
            else if (collider2.colliderType === ColliderType_js_1.ColliderType.Circle) {
            }
            else if (collider2.colliderType === ColliderType_js_1.ColliderType.Capsule) {
            }
        }
        return new Collision_js_1.Collision(collider1.gameObject, collider2.gameObject);
    }
    static collisionBoxBox(collider1, collider2) {
        const collision = new Collision_js_1.Collision(collider1.gameObject, collider2.gameObject);
        //if (collider1.)
        return new Collision_js_1.Collision(collider1.gameObject, collider2.gameObject);
    }
}
exports.Physics = Physics;
//# sourceMappingURL=Physics.js.map
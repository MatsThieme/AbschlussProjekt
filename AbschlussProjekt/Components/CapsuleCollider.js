"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Align_js_1 = require("../Align.js");
const Collider_js_1 = require("../Physics/Collider.js");
const ColliderType_js_1 = require("../Physics/ColliderType.js");
const Vector2_js_1 = require("../Vector2.js");
const ComponentType_js_1 = require("./ComponentType.js");
class CapsuleCollider extends Collider_js_1.Collider {
    constructor(gameObject, relativePosition = new Vector2_js_1.Vector2(), size = new Vector2_js_1.Vector2(1, 1), alignH = Align_js_1.AlignH.Center, alignV = Align_js_1.AlignV.Center) {
        super(gameObject, ComponentType_js_1.ComponentType.CapsuleCollider, relativePosition, ColliderType_js_1.ColliderType.Capsule, alignH, alignV);
        this.size = size;
    }
    colliding() {
        return;
    }
}
exports.CapsuleCollider = CapsuleCollider;
//# sourceMappingURL=CapsuleCollider.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Align_js_1 = require("../Align.js");
const Collider_js_1 = require("./Collider.js");
const ColliderType_js_1 = require("./ColliderType.js");
const Vector2_js_1 = require("../Vector2.js");
class CircleCollider extends Collider_js_1.Collider {
    constructor(gameObject, relativePosition = new Vector2_js_1.Vector2(), alignH = Align_js_1.AlignH.Center, alignV = Align_js_1.AlignV.Center) {
        super(gameObject, relativePosition, ColliderType_js_1.ColliderType.Circle, alignH, alignV);
    }
}
exports.CircleCollider = CircleCollider;
//# sourceMappingURL=CircleCollider.js.map
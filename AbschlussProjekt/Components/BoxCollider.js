"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Align_js_1 = require("../Align.js");
const Collider_js_1 = require("../Physics/Collider.js");
const ColliderType_js_1 = require("../Physics/ColliderType.js");
const Vector2_js_1 = require("../Vector2.js");
const ComponentType_js_1 = require("./ComponentType.js");
class BoxCollider extends Collider_js_1.Collider {
    constructor(gameObject, relativePosition = new Vector2_js_1.Vector2(), size = new Vector2_js_1.Vector2(1, 1), alignH = Align_js_1.AlignH.Center, alignV = Align_js_1.AlignV.Center) {
        super(gameObject, ComponentType_js_1.ComponentType.BoxCollider, relativePosition, ColliderType_js_1.ColliderType.Box, alignH, alignV);
        this.size = size;
    }
}
exports.BoxCollider = BoxCollider;
//# sourceMappingURL=BoxCollider.js.map
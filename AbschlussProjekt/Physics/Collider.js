"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Align_js_1 = require("../Align.js");
const Component_js_1 = require("../Components/Component.js");
const ComponentType_js_1 = require("../Components/ComponentType.js");
const Vector2_js_1 = require("../Vector2.js");
const Transform_js_1 = require("../Components/Transform.js");
class Collider extends Component_js_1.Component {
    constructor(gameObject, type = ComponentType_js_1.ComponentType.Collider, relativePosition, colliderType, alignH = Align_js_1.AlignH.Center, alignV = Align_js_1.AlignV.Center) {
        super(gameObject, type);
        this.relativePosition = relativePosition;
        this.colliderType = colliderType;
        this.alignH = alignH;
        this.alignV = alignV;
    }
    get position() {
        return Vector2_js_1.Vector2.add(this.relativePosition, this.gameObject.getComponent(Transform_js_1.Transform).position);
    }
}
exports.Collider = Collider;
//# sourceMappingURL=Collider.js.map
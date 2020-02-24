"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2_js_1 = require("../Vector2.js");
const Component_js_1 = require("./Component.js");
const ComponentType_js_1 = require("./ComponentType.js");
class Transform extends Component_js_1.Component {
    constructor(gameObject) {
        super(gameObject, ComponentType_js_1.ComponentType.Transform);
        this.position = new Vector2_js_1.Vector2();
        this.rotation = new Vector2_js_1.Vector2();
        this.scale = new Vector2_js_1.Vector2();
    }
}
exports.Transform = Transform;
//# sourceMappingURL=Transform.js.map
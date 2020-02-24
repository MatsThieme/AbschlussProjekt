"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentType_js_1 = require("./ComponentType.js");
class Component {
    constructor(gameObject, type = ComponentType_js_1.ComponentType.Component) {
        this.gameObject = gameObject;
        this.type = type;
    }
}
exports.Component = Component;
//# sourceMappingURL=Component.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transform_js_1 = require("./Components/Transform.js");
class GameObject {
    constructor(name) {
        this.components = [];
        this.name = name;
        this.id = GameObject.nextID++;
        this.transform = this.addComponent(Transform_js_1.Transform);
        GameObject.gameObjects.set(name, this);
    }
    static find(name) {
        return this.gameObjects.get(name);
    }
    addComponent(component) {
        let component_ = new component(this);
        this.components.push(component_);
        return component_;
    }
    getComponents(type) {
        return this.components.filter((c) => c instanceof type);
    }
    getComponent(type) {
        return this.getComponents(type)[0];
    }
}
exports.GameObject = GameObject;
GameObject.gameObjects = new Map();
GameObject.nextID = 0;
//# sourceMappingURL=GameObject.js.map
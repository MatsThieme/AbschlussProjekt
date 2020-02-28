import { Transform } from './Components/Transform.js';
export class GameObject {
    constructor(name) {
        this.components = [];
        this.name = name;
        this.id = GameObject.nextID++;
        this.transform = this.addComponent(Transform);
        this.children = [];
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
    addChild(gameObject) {
        this.children.push(gameObject);
        return gameObject;
    }
}
GameObject.nextID = 0;

import { Transform } from './Components/Transform.js';
var GameObject = /** @class */ (function () {
    function GameObject(name) {
        this.components = [];
        this.name = name;
        this.id = GameObject.nextID++;
        this.transform = this.addComponent(Transform);
        this.children = [];
    }
    GameObject.prototype.addComponent = function (type) {
        var component = new type(this);
        this.components.push(component);
        return component;
    };
    GameObject.prototype.getComponents = function (type) {
        return this.components.filter(function (c) { return c instanceof type; });
    };
    GameObject.prototype.getComponent = function (type) {
        return this.getComponents(type)[0];
    };
    GameObject.prototype.addChild = function (gameObject) {
        this.children.push(gameObject);
        return gameObject;
    };
    GameObject.prototype.update = function () {
        this.children.forEach(function (c) { return c.update(); });
        this.components.forEach(function (c) { return c.update(); });
    };
    GameObject.nextID = 0;
    return GameObject;
}());
export { GameObject };

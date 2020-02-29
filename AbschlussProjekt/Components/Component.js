import { ComponentType } from './ComponentType.js';
var Component = /** @class */ (function () {
    function Component(gameObject, type) {
        if (type === void 0) { type = ComponentType.Component; }
        this.gameObject = gameObject;
        this.type = type;
    }
    Component.prototype.start = function () {
    };
    Component.prototype.update = function () {
    };
    return Component;
}());
export { Component };

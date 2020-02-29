var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Component } from './Component.js';
var Behaviour = /** @class */ (function (_super) {
    __extends(Behaviour, _super);
    function Behaviour(gameObject) {
        var _this = _super.call(this, gameObject) || this;
        _this.start();
        return _this;
    }
    Behaviour.prototype.start = function () {
    };
    Behaviour.prototype.update = function () {
    };
    return Behaviour;
}(Component));
export { Behaviour };

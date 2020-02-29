import { Vector2 } from './Vector2.js';
var Camera = /** @class */ (function () {
    function Camera(resolution) {
        if (resolution === void 0) { resolution = new Vector2(1920, 1080); }
        this.resolution = resolution;
        this.position = new Vector2();
        this.rotation = 0;
    }
    Object.defineProperty(Camera.prototype, "currentFrame", {
        get: function () {
            return this._currentFrame;
        },
        enumerable: true,
        configurable: true
    });
    return Camera;
}());
export { Camera };

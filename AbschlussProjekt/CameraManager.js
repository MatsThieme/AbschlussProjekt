import { Camera } from './Camera.js';
var CameraManager = /** @class */ (function () {
    function CameraManager(domElement) {
        this.cameras = [];
        this.mainCameraIndex = 0;
        this.context = domElement.getContext('2d');
    }
    Object.defineProperty(CameraManager.prototype, "activeCamera", {
        get: function () {
            return this.cameras[this.mainCameraIndex];
        },
        enumerable: true,
        configurable: true
    });
    CameraManager.prototype.addCamera = function (resolution) {
        var newCamera = new Camera(resolution);
        this.cameras.push(newCamera);
        return newCamera;
    };
    CameraManager.prototype.render = function () {
        this.context.drawImage(this.cameras[this.mainCameraIndex].currentFrame, 0, 0);
    };
    return CameraManager;
}());
export { CameraManager };

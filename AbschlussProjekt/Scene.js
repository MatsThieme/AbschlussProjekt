import { CameraManager } from './CameraManager.js';
import { GameObject } from './GameObject.js';
import { GameTime } from './GameTime.js';
var Scene = /** @class */ (function () {
    function Scene() {
        this.domElement = document.createElement('canvas');
        this.gameObjects = new Map();
        this.cameraManager = new CameraManager(this.domElement);
        this.time = new GameTime();
    }
    Scene.prototype.find = function (name) {
        return this.gameObjects.get(name);
    };
    Scene.prototype.newGameObject = function (name) {
        var gameObject = new GameObject(name);
        this.gameObjects.set(name, gameObject);
        return gameObject;
    };
    Scene.prototype.update = function () {
        this.time.update();
        requestAnimationFrame(this.update.bind(this));
    };
    return Scene;
}());
export { Scene };

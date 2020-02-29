import { Scene } from './Scene.js';
import { Vector2 } from './Vector2.js';
var Game = /** @class */ (function () {
    function Game() {
        this.scene = new Scene();
        document.body.appendChild(this.scene.domElement);
        this.scene.cameraManager.addCamera(new Vector2(1920, 1080));
        var v1 = new Vector2(3, 4);
        var v2 = new Vector2(4, 3);
        console.log(v2.angleBetween(new Vector2(0, 0), v1));
    }
    return Game;
}());
new Game();

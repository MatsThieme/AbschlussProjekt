import { Scene } from './Scene.js';
import { Vector2 } from './Vector2.js';

class Game {
    public scene: Scene;
    public constructor() {
        this.scene = new Scene();
        document.body.appendChild(this.scene.domElement);

        this.scene.cameraManager.addCamera(new Vector2(1920, 1080));

        const v1 = new Vector2(3, 4);
        const v2 = new Vector2(4, 3);

        console.log(v2.angleBetween(new Vector2(0, 0), v1));
    }
}

new Game();
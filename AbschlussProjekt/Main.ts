import { CircleCollider } from './Components/CircleCollider.js';
import { Scene } from './Scene.js';
import { Vector2 } from './Vector2.js';

class Game {
    public scene: Scene;
    public constructor() {
        this.scene = new Scene();
        document.body.appendChild(this.scene.domElement);

        this.scene.cameraManager.addCamera(new Vector2(1920, 1080));

        const v = new Vector2(1, 1);
        const incoming = new Vector2(-1, -1);

        const gO = this.scene.newGameObject('colliderTest');
        const collider = gO.addComponent(CircleCollider);
        console.log(collider.recalculateDirection(v, incoming));
    }
}

new Game();
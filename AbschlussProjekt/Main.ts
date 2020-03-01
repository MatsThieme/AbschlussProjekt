import { CircleCollider } from './Components/CircleCollider.js';
import { Scene } from './Scene.js';
import { Vector2 } from './Vector2.js';
import { AsyncWorker } from './Worker/Worker.js';

class Game {
    public scene: Scene;
    public constructor() {
        this.scene = new Scene();
        document.body.appendChild(this.scene.domElement);

        this.scene.newCamera('cam', new Vector2(1920, 1080));

        const contact = new Vector2(0, 1);
        const incoming = new Vector2(0, -1);

        const gO = this.scene.newGameObject('colliderTest');
        const collider = gO.addComponent(CircleCollider);
        console.log(collider.recalculateDirection(contact, incoming).toString());
    }
}

new Game();

AsyncWorker.work('Physics/PhysicsWorker.js', { name: 'testW' }).then(console.log).catch(console.log); 
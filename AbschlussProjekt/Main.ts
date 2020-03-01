import { CircleCollider } from './Components/CircleCollider.js';
import { Physics } from './Physics/Physics.js';
import { Scene } from './Scene.js';
import { Vector2 } from './Vector2.js';
import { BoxCollider } from './Components/BoxCollider.js';

class Game {
    public scene: Scene;
    public constructor() {
        this.scene = new Scene();
        document.body.appendChild(this.scene.domElement);

        this.scene.newCamera('cam', new Vector2(1920, 1080));

        //const contact = new Vector2(0, 1);
        //const incoming = new Vector2(0, -1);

        const gO1 = this.scene.newGameObject('colliderTest1');
        const gO2 = this.scene.newGameObject('colliderTest2');
        const gO3 = this.scene.newGameObject('colliderTest3');

        const box1 = gO1.addComponent(BoxCollider);
        const box2 = gO2.addComponent(BoxCollider);
        const box3 = gO3.addComponent(BoxCollider);


        gO1.transform.position = new Vector2(1, 1);
        gO2.transform.position = new Vector2(1.4, 2.5);
        gO3.transform.position = new Vector2(4, 1);

        box1.size = new Vector2(1, 2);
        box2.size = new Vector2(1.5, 2.5);
        box3.size = new Vector2(1, 1);


        console.log(Physics.collisionBox(box1, box2));
        console.log(Physics.collisionBox(box2, box3));
        console.log(Physics.collisionBox(box3, box1));


        //const c1 = gO1.addComponent(CircleCollider);
        //const c2 = gO2.addComponent(CircleCollider);
        //const c3 = gO3.addComponent(CircleCollider);


        //gO1.transform.position = new Vector2(3, 3);
        //gO2.transform.position = new Vector2(4, 4);
        //gO3.transform.position = new Vector2(1, 2);

        //c1.radius = 1;
        //c2.radius = 1;
        //c3.radius = 0.5;


        //console.log(Physics.CollisionCircle(c1, c2));
        //console.log(Physics.CollisionCircle(c2, c3));
        //console.log(Physics.CollisionCircle(c3, c1));
    }
}

new Game();

//AsyncWorker.work('Physics/PhysicsWorker.js', { name: 'testW' }).then(console.log).catch(console.log);
//const collider = gO.addComponent(CircleCollider);
//console.log(collider.recalculateDirection(contact, incoming).toString());
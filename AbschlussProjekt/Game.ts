import { Angle } from './Angle.js';
import { TestBehaviour } from './Behaviours/TestBehaviour.js';
import { Camera } from './Components/Camera.js';
import { ParticleSystem } from './Components/ParticleSystem.js';
import { Texture } from './Components/Texture.js';
import { Physics } from './Physics/Physics.js';
import { Prefab } from './Prefab.js';
import { Scene } from './Scene.js';
import { Sprite } from './Sprite.js';
import { Vector2 } from './Vector2.js';
import { AsyncWorker } from './Worker/AsyncWorker.js';
import { PolygonCollider } from './Components/PolygonCollider.js';

class Game {
    public scene: Scene;
    public constructor() {
        this.scene = new Scene();
        document.body.appendChild(this.scene.domElement);
        this.scene.domElement.width = 1920;
        this.scene.domElement.height = 1080;

        const camera = this.scene.newCamera('cam').getComponent(Camera);


        const gO1 = this.scene.newGameObject('polygon');
        const polygonCollider1 = gO1.addComponent(PolygonCollider);
        polygonCollider1.vertices = [new Vector2(0, 0), new Vector2(3, 3), new Vector2(0, 3), new Vector2(3, 0)];
        gO1.rigidbody.mass = 1;

        const gO2 = this.scene.newGameObject('polygon');
        gO2.transform.relativePosition = new Vector2(0.01, 0);
        const polygonCollider2 = gO2.addComponent(PolygonCollider);
        //polygonCollider2.vertices = [new Vector2(0, 0), new Vector2(3, 3), new Vector2(0, 3), new Vector2(3, 0)];

        console.log(Physics.collisionPolygon(polygonCollider1, polygonCollider2));
    }
}

new Game();













        //Prefab.load('PrefabTest.prefab', this.scene).then(prefab => this.scene.addPrefab(prefab));




// children


        //const gO1 = this.scene.newGameObject('test');
        //gO1.transform.position.y = 4.5;

        //const texture = gO1.addComponent(Texture);
        //texture.sprite = new Sprite('spriteTest1.png');

        //gO1.addComponent(TestBehaviour);


        //const gO2 = this.scene.newGameObject('child test');
        //gO2.transform.position = new Vector2(1, 1);

        //gO1.addChild(gO2);
        //gO2.addComponent(TestBehaviour);

        //const texturegO2 = gO2.addComponent(Texture);
        //texturegO2.sprite = new Sprite('spriteTest1.png');


        //const gO3 = this.scene.newGameObject('child test');
        //gO3.transform.position = new Vector2(1, 1);

        //gO2.addChild(gO3);
        //gO3.addComponent(TestBehaviour);

        //const texturegO3 = gO3.addComponent(Texture);
        //texturegO3.sprite = new Sprite('spriteTest1.png');


        //const gO4 = this.scene.newGameObject('child test');
        //gO4.transform.position = new Vector2(1, 1);

        //gO3.addChild(gO4);
        //gO4.addComponent(TestBehaviour);

        //const texturegO4 = gO4.addComponent(Texture);
        //texturegO4.sprite = new Sprite('spriteTest1.png');



// particles

        //const gO5 = this.scene.newGameObject('particles');
        //const particleSystem = gO5.addComponent(ParticleSystem);
        //particleSystem.lifeTime = 1000;
        //particleSystem.emission = 100;
        //particleSystem.fadeInDuration = 200;
        //particleSystem.fadeOutDuration = 200;
        //particleSystem.speed = 0.001;
        //particleSystem.rotationSpeed = 0.1;
        //particleSystem.sprites = [new Sprite('spriteTest1.png')];
        //particleSystem.angle = new Angle(undefined, 359);
        //particleSystem.size = new Vector2(0.1, 0.1);

        //gO5.transform.relativeRotation.degree = 90;

































//AsyncWorker.work('Physics/PhysicsWorker.js', { name: 'testW' }).then(console.log).catch(console.log);
//const collider = gO.addComponent(CircleCollider);
//console.log(collider.recalculateDirection(contact, incoming).toString());



        //for (let i = 0; i < 100; i++) gO1.addComponent(CapsuleCollider);
        //for (let i = 0; i < 100; i++) gO1.addComponent(BoxCollider);
        //for (let i = 0; i < 100; i++) gO1.addComponent(CircleCollider);

        //gO1.transform.position = new Vector2(1, 1);
        //gO2.transform.position = new Vector2(1.4, 2.5);
        //gO3.transform.position = new Vector2(4, 1);

        //box1.size = new Vector2(1, 2);
        //box2.size = new Vector2(1.5, 2.5);
        //box3.size = new Vector2(1, 1);


        //Physics.asyncCollision(gO1, gO2).then(console.log).catch(console.log);

        //const x = 1000;

        //console.time('collision');
        //for (let i = 0; i < x; i++) {
        //    Physics.collision(gO1, gO2);
        //}
        //console.timeEnd('collision');

        //(async () => {
        //    console.time('warmup');
        //    await AsyncWorker.createWorker('Physics/PhysicsWorker.js', navigator.hardwareConcurrency || 12);
        //    console.timeEnd('warmup');

        //    const start = performance.now();

        //    for (let i = 0; i < x; i++) {
        //        let y = Physics.asyncCollision(gO1, gO2);
        //        if (i === x - 1) {
        //            await y;
        //            console.log('asyncCollision: ' + (performance.now() - start));
        //        }
        //    }

        //    setTimeout(() => {

        //        //console.time('sgfr');
        //        //Physics.asyncCollision(gO1, gO2).then(() => console.timeEnd('sgfr'));
        //    }, 1000);

        //})();


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

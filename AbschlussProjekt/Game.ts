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
import { PolygonRenderer } from './Components/PolygonRenderer.js';
import { AlignH, AlignV } from './Align.js';
import { Move } from './Behaviours/Move.js';
import { Collider } from './Components/Collider.js';
import { PhysicsMaterial } from './Physics/PhysicsMaterial.js';
import { Line } from './Line.js';
import { CircleCollider } from './Components/CircleCollider.js';
import { CircleRenderer } from './Components/CircleRenderer.js';
import { ReloadPage } from './Behaviours/ReloadPage.js';
import { reduce, asyncTimeout } from './Helpers.js';

class Game {
    public scene: Scene;
    public constructor() {
        this.scene = new Scene();

        this.initialize();
    }
    async initialize(): Promise<void> {
        document.body.appendChild(this.scene.domElement);
        this.scene.domElement.width = innerWidth;
        this.scene.domElement.height = innerHeight;
        this.scene.domElement.style.position = 'absolute';
        this.scene.domElement.style.left = '0px';
        this.scene.domElement.style.top = '0px';
        document.body.style.overflow = 'hidden';


        this.scene.newCamera('cam', camera => {
            camera.resolution = new Vector2(innerWidth, innerHeight);
            camera.size = new Vector2(16, 9);
        });


        this.scene.newGameObject('polygon', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(-2, 0.2), new Vector2(1.5, 1), new Vector2(1, 1.1), new Vector2(0.5, 1), new Vector2(1, 0)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(0, 2);
            gameObject.rigidbody.useAutoMass = true;
            gameObject.addComponent(PolygonRenderer);
        });

        this.scene.newGameObject('polygon', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1), new Vector2(1, 0)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(0, 0);
            gameObject.rigidbody.useAutoMass = true;
            gameObject.addComponent(PolygonRenderer);
            gameObject.addComponent(Move);
            gameObject.addComponent(ReloadPage);
        });

        //this.scene.newGameObject('circle', gameObject => {
        //    gameObject.addComponent(CircleCollider, circleCollider => {
        //        circleCollider.material = new PhysicsMaterial(0, 1, 1);
        //    });

        //    gameObject.transform.relativePosition = new Vector2(0, -2);
        //    gameObject.rigidbody.useAutoMass = true;
        //    gameObject.addComponent(Move);
        //    gameObject.addComponent(CircleRenderer);
        //});



        this.scene.newGameObject('xAxis', gameObject => {
            gameObject.addComponent(Texture, texture => {
                texture.sprite = new Sprite('spriteTest1.png');
            });

            gameObject.transform.relativeScale = new Vector2(10000, 0.01);
            gameObject.drawPriority = -1;
        });

        this.scene.newGameObject('yAxis', gameObject => {
            gameObject.addComponent(Texture, texture => {
                texture.sprite = new Sprite('spriteTest1.png');
            });

            gameObject.transform.relativeScale = new Vector2(0.01, 10000);
            gameObject.drawPriority = -1;
        });




        this.scene.newGameObject('left', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 0), new Vector2(0, 1)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(-8, 0);
            gameObject.transform.relativeScale = new Vector2(0.5, 100);
            gameObject.addComponent(PolygonRenderer);
        });

        this.scene.newGameObject('right', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 0), new Vector2(0, 1)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(8, 0);
            gameObject.transform.relativeScale = new Vector2(0.5, 100);
            gameObject.addComponent(PolygonRenderer);
        });

        this.scene.newGameObject('top', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 0), new Vector2(0, 1)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(0, 4.5);
            gameObject.transform.relativeScale = new Vector2(100, 0.5);
            gameObject.addComponent(PolygonRenderer);
        });

        this.scene.newGameObject('floor', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 0), new Vector2(0, 1)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(0, -4.5);
            gameObject.transform.relativeScale = new Vector2(100, 0.5);
            gameObject.addComponent(PolygonRenderer);
        });



        //await asyncTimeout(1000);

        this.scene.start();
    }
}

new Game();

//to fix:
// polygon collision (normal direction)

// to do: 
// friction
// loading prefabs 
// simplify polygon collision detection, function collision(vertices1: Vector[], vertices2: Vector2[]): {contacts, collisionNormal...}
// ui
// loading screen while scene not running
// camera aspect ratio
// input
// polygon circle collision, circle circle collision
// no rigidbody in child objects
// use child object collider in collision calculations
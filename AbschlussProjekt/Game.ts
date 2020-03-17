import { Move } from './Behaviours/Move.js';
import { ReloadPage } from './Behaviours/ReloadPage.js';
import { PolygonCollider } from './Components/PolygonCollider.js';
import { PolygonRenderer } from './Components/PolygonRenderer.js';
import { Texture } from './Components/Texture.js';
import { asyncTimeout } from './Helpers.js';
import { PhysicsMaterial } from './Physics/PhysicsMaterial.js';
import { TestPrefab } from './Prefabs/TestPrefab.js';
import { Scene } from './Scene.js';
import { Sprite } from './Sprite.js';
import { Vector2 } from './Vector2.js';

class Game {
    public scene: Scene;
    public constructor() {
        this.scene = new Scene();

        this.initialize(this.scene).then(() => this.scene.start());
    }
    async initialize(scene: Scene): Promise<void> {
        document.body.appendChild(scene.domElement);
        scene.domElement.width = innerWidth;
        scene.domElement.height = innerHeight;
        scene.domElement.style.position = 'absolute';
        scene.domElement.style.left = '0px';
        scene.domElement.style.top = '0px';
        document.body.style.overflow = 'hidden';


        scene.newCamera('camera', camera => {
            camera.resolution = new Vector2(innerWidth, innerHeight);
            camera.size = new Vector2(16, 9);
        });


        scene.newGameObject('polygon', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(-2, 0.2), new Vector2(1.5, 1), new Vector2(1, 1.1), new Vector2(0.5, 1), new Vector2(1, 0)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(0, 2);
            gameObject.rigidbody.useAutoMass = true;
            gameObject.addComponent(PolygonRenderer);
        });

        scene.newGameObject('polygon', gameObject => {
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

        //scene.newGameObject('circle', gameObject => {
        //    gameObject.addComponent(CircleCollider, circleCollider => {
        //        circleCollider.material = new PhysicsMaterial(0, 1, 1);
        //    });

        //    gameObject.transform.relativePosition = new Vector2(0, -2);
        //    gameObject.rigidbody.useAutoMass = true;
        //    gameObject.addComponent(Move);
        //    gameObject.addComponent(CircleRenderer);
        //});



        scene.newGameObject('xAxis', gameObject => {
            gameObject.addComponent(Texture, texture => {
                texture.sprite = new Sprite('spriteTest1.png');
            });

            gameObject.transform.relativeScale = new Vector2(10000, 0.01);
            gameObject.drawPriority = -1;
        });

        scene.newGameObject('yAxis', gameObject => {
            gameObject.addComponent(Texture, texture => {
                texture.sprite = new Sprite('spriteTest1.png');
            });

            gameObject.transform.relativeScale = new Vector2(0.01, 10000);
            gameObject.drawPriority = -1;
        });



        scene.newGameObject('left', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 0), new Vector2(0, 1)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(-8, 0);
            gameObject.transform.relativeScale = new Vector2(0.5, 100);
            gameObject.addComponent(PolygonRenderer);
        });

        scene.newGameObject('right', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 0), new Vector2(0, 1)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(8, 0);
            gameObject.transform.relativeScale = new Vector2(0.5, 100);
            gameObject.addComponent(PolygonRenderer);
        });

        scene.newGameObject('top', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 0), new Vector2(0, 1)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(0, 4.5);
            gameObject.transform.relativeScale = new Vector2(100, 0.5);
            gameObject.addComponent(PolygonRenderer);
        });

        scene.newGameObject('floor', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 0), new Vector2(0, 1)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(0, -4.5);
            gameObject.transform.relativeScale = new Vector2(100, 0.5);
            gameObject.addComponent(PolygonRenderer);
        });


        scene.newGameObject('prefab test', TestPrefab);

        this.createLoadingScreen(scene);

        await asyncTimeout(1000);
    }
    createLoadingScreen(scene: Scene): void {
        let counter = 0;
        scene.loadingScreen = (context, canvas) => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.font = `${canvas.width / 100}px arial`;
            context.fillText(`Loading${'.'.repeat(~~(counter++ / 5 % 4))}`, canvas.width / 2, canvas.height / 2);
        };
    }
}

new Game();

//to fix:
// polygon collision (normal direction)
// particlesystem align
// camera aspect ratio
// polygon circle collision, circle circle collision

// to do:
// friction
// simplify polygon collision detection, function collision(vertices1: Vector[], vertices2: Vector2[]): {contacts, collisionNormal...}
// ui
// no rigidbody in child objects
// use child object collider in collision calculations
import { CameraManager } from './CameraManager.js';
import { Camera } from './Components/Camera.js';
import { RigidBody } from './Components/RigidBody.js';
import { GameObject } from './GameObject.js';
import { GameTime } from './GameTime.js';
import { Collision } from './Physics/Collision.js';
import { Physics } from './Physics/Physics.js';
import { Vector2 } from './Vector2.js';

export class Scene {
    public readonly domElement: HTMLCanvasElement;
    public gameObjects: Map<string, GameObject>;
    public cameraManager: CameraManager;
    public time: GameTime;
    public constructor() {
        this.domElement = document.createElement('canvas');
        this.gameObjects = new Map();
        this.cameraManager = new CameraManager(this.domElement);
        this.time = new GameTime();

        requestAnimationFrame(this.update.bind(this));
    }
    public find(name: string): GameObject {
        return <GameObject>this.gameObjects.get(name);
    }
    public newGameObject(name: string): GameObject {
        const gameObject = new GameObject(name);
        this.gameObjects.set(name, gameObject);
        return gameObject;
    }
    public newCamera(name: string, resolution: Vector2 = new Vector2(1920, 1080)): GameObject {
        const gameObject = new GameObject(name);
        this.gameObjects.set(name, gameObject);

        const camera = gameObject.addComponent(Camera);
        camera.resolution = new Vector2(1920, 1080);
        this.cameraManager.cameras.push(camera);

        return gameObject;
    }
    private update() {
        this.time.update();

        const collisions: Collision[] = [];

        for (const gO1 of this.gameObjects.values()) {
            for (const gO2 of this.gameObjects.values()) {
                if (gO1.id !== gO2.id) collisions.push(...Physics.collision(gO1, gO2));
            }
        }

        const rigidbodies = [...this.gameObjects.values()].map(gO => gO.getComponent(RigidBody)).filter(rb => rb);

        rigidbodies.forEach(rb => rb.update(this.time, collisions));

        for (const gameObject of this.gameObjects.values()) {
            gameObject.update(this.time);
        }

        requestAnimationFrame(this.update.bind(this));
    }
}
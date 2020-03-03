import { CameraManager } from './CameraManager.js';
import { Camera } from './Components/Camera.js';
import { GameObject } from './GameObject.js';
import { GameTime } from './GameTime.js';
import { Collision } from './Physics/Collision.js';
import { Physics } from './Physics/Physics.js';

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
        const gameObject = new GameObject(name, this);
        this.gameObjects.set(name, gameObject);
        return gameObject;
    }
    public newCamera(name: string): GameObject {
        const gameObject = new GameObject(name, this);
        this.gameObjects.set(name, gameObject);

        const camera = gameObject.addComponent(Camera);
        this.cameraManager.cameras.push(camera);

        return gameObject;
    }
    private async update() {
        this.time.update();

        const collisions: Collision[] = [];

        for (const gO1 of this.gameObjects.values()) {
            for (const gO2 of this.gameObjects.values()) {
                if (gO1.id !== gO2.id && gO1.active && gO2.active) collisions.push(...await Physics.asyncCollision(gO1, gO2));
            }
        }

        const rigidbodies = [...this.gameObjects.values()].filter(gO => gO.active).map(gO => gO.rigidbody);

        rigidbodies.forEach(rb => rb.update(this.time, collisions));

        for (const gameObject of this.gameObjects.values()) {
            await gameObject.update(this.time);
        }

        this.cameraManager.update([...this.gameObjects.values()]);

        requestAnimationFrame(this.update.bind(this));
    }
}
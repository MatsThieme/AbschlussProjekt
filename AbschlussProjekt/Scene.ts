import { CameraManager } from './CameraManager.js';
import { Camera } from './Components/Camera.js';
import { GameObject } from './GameObject.js';
import { GameTime } from './GameTime.js';
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



        requestAnimationFrame(this.update.bind(this));
    }
}
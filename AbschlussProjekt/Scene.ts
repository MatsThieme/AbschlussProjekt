import { CameraManager } from './CameraManager.js';
import { GameObject } from './GameObject.js';
import { GameTime } from './GameTime.js';

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
    }
    public find(name: string): GameObject {
        return <GameObject>this.gameObjects.get(name);
    }
    public newGameObject(name: string): GameObject {
        const gameObject = new GameObject(name);
        this.gameObjects.set(name, gameObject);
        return gameObject;
    }
    private update() {
        this.time.update();



        requestAnimationFrame(this.update.bind(this));
    }
}
import { CameraManager } from './CameraManager.js';
import { GameObject } from './GameObject.js';

export class Scene {
    public readonly domElement: HTMLCanvasElement;
    public gameObjects: Map<string, GameObject>;
    public cameraManager: CameraManager;
    public constructor() {
        this.domElement = document.createElement('canvas');
        this.gameObjects = new Map();
        this.cameraManager = new CameraManager();
    }
    public find(name: string): GameObject {
        return <GameObject>this.gameObjects.get(name);
    }
    public newGameObject(name: string): GameObject {
        this.gameObjects.set(name, new GameObject(name));
        return this.find(name);
    }
}
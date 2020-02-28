import { CameraManager } from './CameraManager.js';
import { GameObject } from './GameObject.js';
export class Scene {
    constructor() {
        this.domElement = document.createElement('canvas');
        this.gameObjects = new Map();
        this.cameraManager = new CameraManager();
    }
    find(name) {
        return this.gameObjects.get(name);
    }
    newGameObject(name) {
        this.gameObjects.set(name, new GameObject(name));
        return this.find(name);
    }
}

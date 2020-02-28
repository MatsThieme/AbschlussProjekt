import { GameObject } from './GameObject.js';
export class Scene {
    constructor() {
        this.gameObjects = new Map();
    }
    find(name) {
        return this.gameObjects.get(name);
    }
    newGameObject(name) {
        this.gameObjects.set(name, new GameObject(name));
        return this.find(name);
    }
}

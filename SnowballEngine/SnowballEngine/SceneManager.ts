import { Scene } from './Scene.js';

export class SceneManager {
    private scenes: Map<string, Scene>;
    private activeScene?: Scene;
    public constructor() {
        this.scenes = new Map();
    }
    public create(name: string): Scene {
        const scene = new Scene();

        this.scenes.set(name, scene);

        return scene;
    }
    public load(name: string): Scene | undefined {
        const scene = this.scenes.get(name);

        if (scene) {
            this.activeScene?.stop();

            scene.start();
            this.activeScene = scene;
        }

        return scene;
    }
}
import { CameraManager } from './CameraManager.js';
import { Camera } from './Components/Camera.js';
import { GameObject } from './GameObject.js';
import { GameTime } from './GameTime.js';
import { Input } from './Input/Input.js';
import { Collision } from './Physics/Collision.js';
import { Physics } from './Physics/Physics.js';
import { Vector2 } from './Vector2.js';
import { ComponentType } from './Components/ComponentType.js';
import { Behaviour } from './Components/Behaviour.js';

export class Scene {
    public readonly domElement: HTMLCanvasElement;
    public gameObjects: Map<string, GameObject>;
    public cameraManager: CameraManager;
    public gameTime: GameTime;
    public input: Input;
    public constructor() {
        this.domElement = document.createElement('canvas');
        this.gameObjects = new Map();
        this.cameraManager = new CameraManager(this.domElement);
        this.gameTime = new GameTime();
        this.input = new Input(this.gameTime);

        [...this.gameObjects.values()].forEach(gO => (<Behaviour[]>gO.getComponents(ComponentType.Behaviour)).forEach(b => b.start()));

        requestAnimationFrame(this.update.bind(this));
    }
    public find(name: string): GameObject {
        return <GameObject>this.gameObjects.get(name);
    }
    public newGameObject(name: string): GameObject {
        name = this.correctName(name);
        const gameObject = new GameObject(name, this);
        this.gameObjects.set(name, gameObject);
        return gameObject;
    }
    public newCamera(name: string): GameObject {
        const gameObject = this.newGameObject(name);

        const camera = gameObject.addComponent(Camera);
        this.cameraManager.cameras.push(camera);

        return gameObject;
    }
    public addPrefab(gameObject: GameObject): GameObject {
        gameObject.name = this.correctName(name);
        this.gameObjects.set(gameObject.name, gameObject);
        return gameObject;
    }
    private async update() {
        this.gameTime.update();

        // get and solve all collisions
        const collisions: Collision[] = [];
        const idPairs: string[] = [];

        for (const gO1 of this.gameObjects.values()) {
            for (const gO2 of this.gameObjects.values()) {
                const idPair = JSON.stringify([gO1.id, gO2.id].sort((a, b) => a - b));
                if (gO1.id !== gO2.id && gO1.active && gO2.active && idPairs.indexOf(idPair) === -1) {
                    collisions.push(...await Physics.asyncCollision(gO1, gO2));
                    idPairs.push(idPair);
                }
            }
        }

        const rigidbodies = [...this.gameObjects.values()].filter(gO => gO.active).map(gO => gO.rigidbody);

        rigidbodies.forEach(rb => rb.update(this.gameTime, collisions)); // apply forces and move body

        for (const gameObject of this.gameObjects.values()) {
            await gameObject.update(this.gameTime, collisions);
        }

        this.cameraManager.update([...this.gameObjects.values()]);

        requestAnimationFrame(this.update.bind(this));
    }
    private correctName(name: string): string {
        if (/.* \(\d\)/.test(name)) {
            name = (<RegExpMatchArray>name.match(/(.*) \(\d+\)/))[1];
        }

        const sameNames = [...this.gameObjects.keys()].filter(gO => new RegExp(name + '(?: \(\d+\))?').test(gO));

        return name + ' (' + sameNames.length + ')';
    }
}
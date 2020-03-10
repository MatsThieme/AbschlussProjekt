import { CameraManager } from './CameraManager.js';
import { Behaviour } from './Components/Behaviour.js';
import { Camera } from './Components/Camera.js';
import { ComponentType } from './Components/ComponentType.js';
import { GameObject } from './GameObject.js';
import { GameTime } from './GameTime.js';
import { Input } from './Input/Input.js';
import { Collision } from './Physics/Collision.js';
import { Physics } from './Physics/Physics.js';
import { Collider } from './Components/Collider.js';

export class Scene {
    public readonly domElement: HTMLCanvasElement;
    private gameObjects: Map<string, GameObject>;
    public cameraManager: CameraManager;
    public gameTime: GameTime;
    public input: Input;
    public constructor() {
        this.domElement = document.createElement('canvas');
        this.gameObjects = new Map();
        this.cameraManager = new CameraManager(this.domElement);
        this.gameTime = new GameTime();
        this.input = new Input(this.gameTime);

        [...this.gameObjects.values()].forEach(gO => gO.getComponents<Behaviour>(ComponentType.Behaviour).forEach(b => b.start()));

        requestAnimationFrame(this.update.bind(this));
    }
    /**
     * 
     * @param name gameObject name
     * 
     * @returns GameObject of name [´name´] if found in gameObjects.
     * 
     */
    public find(name: string): GameObject | undefined {
        return this.gameObjects.get(name);
    }
    public newGameObject(name: string): GameObject {
        name = this.uniqueGameObjectName(name);
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
        gameObject.name = this.uniqueGameObjectName(name);
        this.gameObjects.set(gameObject.name, gameObject);
        return gameObject;
    }
    private async update() {
        this.gameTime.update();

        this.getAllGameObjects().forEach(gO => gO.getComponents<Collider>(ComponentType.Collider).forEach(c => c.update()));

        // get and solve all collisions
        const collisions: Collision[] = [];
        const idPairs: string[] = [];

        for (const gO1 of this.gameObjects.values()) {
            if (!gO1.getComponent<Collider>(ComponentType.Collider)) continue;
            for (const gO2 of this.gameObjects.values()) {
                if (!gO2.getComponent<Collider>(ComponentType.Collider)) continue;
                const idPair = JSON.stringify([gO1.id, gO2.id].sort((a, b) => a - b));
                if (gO1.id !== gO2.id && gO1.active && gO2.active && idPairs.indexOf(idPair) === -1) {
                    collisions.push(...await Physics.asyncCollision(gO1, gO2));
                    idPairs.push(idPair);
                }
            }
        }

        //console.log(collisions.length + JSON.stringify(idPairs));

        const rigidbodies = [...this.gameObjects.values()].filter(gO => gO.active).map(gO => gO.rigidbody);

        rigidbodies.forEach(rb => rb.update(this.gameTime, collisions)); // apply forces and move body

        for (const gameObject of this.gameObjects.values()) {
            await gameObject.update(this.gameTime, collisions);
        }

        this.cameraManager.update([...this.gameObjects.values()]);

        requestAnimationFrame(this.update.bind(this));
    }
    /**
     * 
     * Looks for GameObjects with same name and appends a number in parentheses to ensure that there are no duplicate names. Example: gameObject -> gameObject (0)
     *
     * @param name gameObject name
     *  
     * @returns unique name
     * 
     */
    public uniqueGameObjectName(name: string): string {
        if (/.* \(\d\)/.test(name)) {
            name = (<RegExpMatchArray>name.match(/(.*) \(\d+\)/))[1];
        }

        const sameNames = [...this.gameObjects.keys()].filter(gO => new RegExp(name + '(?: \(\d+\))?').test(gO));

        return name + ' (' + sameNames.length + ')';
    }
    /**
     * Returns all GameObjects in this Scene.
     */
    public getAllGameObjects(): GameObject[] {
        return [...this.gameObjects.values()];
    }
}
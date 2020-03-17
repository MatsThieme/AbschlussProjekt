import { CameraManager } from './CameraManager.js';
import { Behaviour } from './Components/Behaviour.js';
import { Camera } from './Components/Camera.js';
import { Collider } from './Components/Collider.js';
import { ComponentType } from './Components/ComponentType.js';
import { GameObject } from './GameObject.js';
import { GameTime } from './GameTime.js';
import { awaitPromises } from './Helpers.js';
import { Input } from './Input/Input.js';
import { Collision } from './Physics/Collision.js';
import { Physics } from './Physics/Physics.js';
import { Framedata } from './Framedata.js';

export class Scene {
    public readonly domElement: HTMLCanvasElement;
    private gameObjects: Map<string, GameObject>;
    public cameraManager: CameraManager;
    public gameTime: GameTime;
    public input: Input;
    private requestAnimationFrameHandle: number | undefined;
    public framedata: Framedata;
    public constructor() {
        this.domElement = document.createElement('canvas');
        this.gameObjects = new Map();
        this.cameraManager = new CameraManager(this.domElement);
        this.gameTime = new GameTime();
        this.input = new Input(this.gameTime);
        this.framedata = new Framedata();
    }
    /**
     * 
     * @param name gameObject name
     * 
     * @returns GameObject of name ´name´ if found in gameObjects.
     * 
     */
    public find(name: string): GameObject | undefined {
        return this.gameObjects.get(name);
    }
    public newGameObject(name: string, cb?: (gameObject: GameObject) => any): GameObject {
        const gameObject = new GameObject(name, this);
        this.gameObjects.set(gameObject.name, gameObject);
        if (cb) cb(gameObject);
        return gameObject;
    }
    public newCamera(name: string, cb?: (camera: Camera) => any): GameObject {
        const gameObject = this.newGameObject(name);

        const camera = gameObject.addComponent(Camera);
        this.cameraManager.cameras.push(camera);

        return gameObject;
    }
    public addPrefab(gameObject: GameObject): GameObject {
        gameObject.name = name;
        this.gameObjects.set(gameObject.name, gameObject);
        return gameObject;
    }
    private async update() {
        this.framedata.update();

        // calculate deltaTime
        this.gameTime.update();

        // update collider
        this.getAllGameObjects().forEach(gO => gO.getComponents<Collider>(ComponentType.Collider).forEach(c => c.update(this.gameTime)));

        // get and solve all collisions
        const idPairs: string[] = [];
        const collisionPromises: Promise<Collision[]>[] = [];

        for (const gO1 of this.gameObjects.values()) {
            if (!gO1.getComponent<Collider>(ComponentType.Collider)) continue;
            for (const gO2 of this.gameObjects.values()) {
                if (!gO2.getComponent<Collider>(ComponentType.Collider)) continue;
                const idPair = JSON.stringify([gO1.id, gO2.id].sort((a, b) => a - b));
                if (gO1.id !== gO2.id && gO1.active && gO2.active && idPairs.indexOf(idPair) === -1) {
                    collisionPromises.push(Physics.asyncCollision(gO1, gO2));
                    idPairs.push(idPair);
                }
            }
        }

        const collisions: Collision[] = (await awaitPromises(...collisionPromises)).reduce((t, c) => { t.push(...c); return t; }, <Collision[]>[]); // wait for all collision calculations


        const rigidbodies = [...this.gameObjects.values()].filter(gO => gO.active).map(gO => gO.rigidbody);

        rigidbodies.forEach(rb => rb.update(this.gameTime, collisions)); // apply forces and move body
        await awaitPromises(...this.getAllGameObjects().map(gameObject => gameObject.update(this.gameTime, collisions)));

        //for (const gameObject of this.gameObjects.values()) {
        //    await gameObject.update(this.gameTime, collisions);
        //}

        this.cameraManager.update([...this.gameObjects.values()]);

        requestAnimationFrame(this.update.bind(this));
    }
    /**
     * Returns all GameObjects in this Scene.
     */
    public getAllGameObjects(): GameObject[] {
        return [...this.gameObjects.values()];
    }
    public async start(): Promise<void> {
        for (const gameObject of this.getAllGameObjects()) {
            await awaitPromises(...gameObject.getComponents<Behaviour>(ComponentType.Behaviour).map(b => b.start()));
        }

        this.requestAnimationFrameHandle = requestAnimationFrame(this.update.bind(this));
    }
    public stop(): void {
        if (this.requestAnimationFrameHandle) cancelAnimationFrame(this.requestAnimationFrameHandle);
    }
    public get isRunning(): boolean {
        return typeof this.requestAnimationFrameHandle === 'number';
    }
    public destroyGameObject(name: string) {
        this.gameObjects.delete(name);
    }
}
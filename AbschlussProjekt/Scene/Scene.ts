import { awaitPromises } from '../Helpers.js';
import { CameraManager } from './Camera/CameraManager.js';
import { Framedata } from './Framedata.js';
import { Behaviour } from './GameObject/Components/Behaviour.js';
import { Camera } from './GameObject/Components/Camera.js';
import { Collider } from './GameObject/Components/Collider.js';
import { ComponentType } from './GameObject/Components/ComponentType.js';
import { GameObject } from './GameObject/GameObject.js';
import { GameTime } from './GameTime.js';
import { Input } from './Input/Input.js';
import { AABB } from './Physics/AABB.js';
import { Collision } from './Physics/Collision.js';
import { Physics } from './Physics/Physics.js';
import { UI } from './UI/UI.js';
import { Vector2 } from './Vector2.js';
import { AsyncWorker } from './Worker/AsyncWorker.js';
import { Settings } from './Settings.js';

export class Scene {
    public readonly domElement: HTMLCanvasElement;
    private gameObjects: Map<string, GameObject>;
    public cameraManager: CameraManager;
    public gameTime: GameTime;
    public input: Input;
    public ui: UI;
    private requestAnimationFrameHandle?: number;
    public framedata: Framedata;
    public loadingScreen?: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => any;
    private loadingScreenInterval?: number;
    public hasAudioListener: boolean;
    public constructor() {
        this.domElement = document.createElement('canvas');
        this.domElement.style.position = 'absolute';
        this.domElement.style.left = '0px';
        this.domElement.style.top = '0px';
        this.domElement.style.overflow = 'hidden';

        this.gameObjects = new Map();
        this.cameraManager = new CameraManager(this.domElement);
        this.gameTime = new GameTime();
        this.input = new Input(this);
        this.ui = new UI(this.input, new AABB(new Vector2(1920, 1080), new Vector2()), this);
        this.framedata = new Framedata();
        this.hasAudioListener = false;

        this.stop();
    }
    /**
     * 
     * @param name gameObject name
     * 
     * @returns GameObject if present in Scene
     * 
     */
    public find(name: string): GameObject | undefined {
        return this.gameObjects.get(name) || this.gameObjects.get([...this.gameObjects.keys()].find(n => (n.match(/(.*) \(\d+\)/) || '')[1] === name) || '');
    }
    public newGameObject(name: string, ...cb: ((gameObject: GameObject) => any)[]): GameObject {
        const gameObject = new GameObject(name, this);
        this.gameObjects.set(gameObject.name, gameObject);
        if (cb) cb.forEach(cb => cb(gameObject));

        return gameObject;
    }
    public newCamera(name: string, cb?: (camera: Camera) => any): GameObject {
        const gameObject = this.newGameObject(name);

        const camera = gameObject.addComponent(Camera);
        this.cameraManager.cameras.push(camera);
        if (cb) cb(camera);
        return gameObject;
    }
    private async update() {
        // calculate deltaTime
        this.gameTime.update();

        this.input.update();

        this.framedata.update();

        if (!this.ui.pauseScene) {
            // update collider
            this.getAllGameObjects().forEach(gO => gO.getComponents<Collider>(ComponentType.Collider).forEach(c => c.update(this.gameTime)));

            // get and solve all collisions
            const idPairs: string[] = [];
            const collisionPromises: Promise<Collision[]>[] = [];

            for (const gO1 of this.gameObjects.values()) {
                if (!gO1.collider || gO1.parent) continue;
                for (const gO2 of this.gameObjects.values()) {
                    if (!gO2.collider || gO2.parent) continue;
                    const idPair = JSON.stringify([gO1.id, gO2.id].sort((a, b) => a - b));
                    if (gO1.id !== gO2.id && gO1.active && gO2.active && idPairs.indexOf(idPair) === -1) {
                        collisionPromises.push(Physics.collision(gO1, gO2));
                        idPairs.push(idPair);
                    }
                }
            }

            let aP;

            try {
                aP = await awaitPromises(...collisionPromises);
            } catch{
                console.log('zu langsam');
            }

            const collisions: Collision[] = (aP || []).reduce((t, c) => { t.push(...c); return t; }, <Collision[]>[]); // wait for all collision calculations


            const rigidbodies = this.getAllGameObjects().map(gO => gO.rigidbody);

            rigidbodies.forEach(rb => rb.update(this.gameTime, collisions)); // apply forces and move body
            await awaitPromises(...this.getAllGameObjects().map(gameObject => gameObject.update(this.gameTime, collisions)));
        }

        this.ui.update(this.gameTime);

        this.cameraManager.update(this.getAllGameObjects(), this.ui.currentFrame);


        if (this.requestAnimationFrameHandle) requestAnimationFrame(this.update.bind(this));
    }
    /**
     * Returns all GameObjects in this Scene.
     */
    public getAllGameObjects(): GameObject[] {
        return [...this.gameObjects.values()];
    }
    public async start(): Promise<void> {
        //await AsyncWorker.createWorker(Settings.appPath + '/Scene/Physics/PolygonCollisionWorker.js', navigator.hardwareConcurrency);
        //await AsyncWorker.createWorker(Settings.appPath + '/Scene/Physics/CircleCollisionWorker.js', navigator.hardwareConcurrency);
        //await AsyncWorker.createWorker(Settings.appPath + '/Scene/Physics/PolygonCircleCollisionWorker.js', navigator.hardwareConcurrency);

        await AsyncWorker.createWorker(Settings.appPath + '/Scene/Physics/CollisionWorker.js', 1);


        for (const gameObject of this.getAllGameObjects()) {
            await awaitPromises(...gameObject.getComponents<Behaviour>(ComponentType.Behaviour).map(b => b.start()));
        }

        this.requestAnimationFrameHandle = requestAnimationFrame(this.update.bind(this));
    }
    public stop(): void {
        if (this.requestAnimationFrameHandle) cancelAnimationFrame(this.requestAnimationFrameHandle);
        this.requestAnimationFrameHandle = undefined;

        if (!this.loadingScreenInterval) this.loadingScreenInterval = setInterval(<TimerHandler>(() => {
            if (this.loadingScreen && !this.isRunning) this.loadingScreen(<CanvasRenderingContext2D>(<any>this.cameraManager).context, <HTMLCanvasElement>(<any>this.cameraManager).context.canvas);
            else if (this.isRunning && this.loadingScreenInterval) {
                clearInterval(this.loadingScreenInterval);
                this.loadingScreenInterval = undefined;
            }
        }), 100);
    }
    public get isRunning(): boolean {
        return typeof this.requestAnimationFrameHandle === 'number';
    }
    public destroyGameObject(name: string) {
        this.gameObjects.delete(name);
    }
}
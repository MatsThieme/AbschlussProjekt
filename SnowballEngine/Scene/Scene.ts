import { awaitPromises } from './Helpers.js';
import { CameraManager } from './Camera/CameraManager.js';
import { Framedata } from './Framedata.js';
import { Behaviour } from './GameObject/Components/Behaviour.js';
import { Camera } from './GameObject/Components/Camera.js';
import { Collider } from './GameObject/Components/Collider.js';
import { ComponentType } from './GameObject/Components/ComponentType.js';
import { GameObject } from './GameObject/GameObject.js';
import { GameTime } from './GameTime.js';
import { Input } from './Input/Input.js';
import { Collision } from './Physics/Collision.js';
import { Physics } from './Physics/Physics.js';
import { UI } from './UI/UI.js';

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
        this.ui = new UI(this.input, this);
        this.framedata = new Framedata();
        this.hasAudioListener = false;


        this.stop();
    }

    /**
     * 
     * @returns GameObject if present in Scene.
     * 
     */
    public find(name: string): GameObject | undefined {
        return this.gameObjects.get(name) || this.gameObjects.get([...this.gameObjects.keys()].find(n => (n.match(/(.*) \(\d+\)/) || '')[1] === name) || '');
    }

    /**
     * 
     * Create new GameObject with name and execute callbacks.
     * 
     */
    public newGameObject(name: string, ...cb: ((gameObject: GameObject) => any)[]): GameObject {
        const gameObject = new GameObject(name, this);
        this.gameObjects.set(gameObject.name, gameObject);
        if (cb) cb.forEach(cb => cb(gameObject));

        return gameObject;
    }

    /**
     *
     * Create new Camera.
     *
     */
    public newCamera(name: string, cb?: (camera: Camera) => any): GameObject {
        const gameObject = this.newGameObject(name);

        const camera = gameObject.addComponent(Camera);
        this.cameraManager.cameras.push(camera);
        if (cb) cb(camera);
        return gameObject;
    }

    /**
     * 
     * Updates...
     * gameTime
     * input
     * framedata
     * collider
     * collisions
     * rigidbodies
     * gameObjects
     * ui
     * cameraManager
     * 
     */
    private async update() {
        this.gameTime.update();

        this.input.update();

        this.framedata.update();

        if (!this.ui.pauseScene) {
            const gameObjects = this.getAllGameObjects();

            gameObjects.forEach(gO => gO.getComponents<Collider>(ComponentType.Collider).forEach(c => c.update(this.gameTime)));


            const idPairs: any = [];
            const collisionPromises: Promise<Collision>[] = [];

            const gOs = gameObjects.filter(gO => gO.active && gO.hasCollider && !gO.parent);


            let total = 0;

            for (const gO1 of gOs) {
                for (const gO2 of gOs) {
                    const id = gO1.id > gO2.id ? (gO1.id << 16) + gO2.id : (gO2.id << 16) + gO1.id;

                    if (gO1.id !== gO2.id && !idPairs[id]) {
                        const start = performance.now();
                        const collisions = Physics.collision(gO1, gO2);
                        total += performance.now() - start;
                        collisionPromises.push(...collisions);
                        idPairs[id] = 1;
                    }
                }
            }



            //console.log(total);

            const collisions: Collision[] = [];

            //console.time('s');

            for (const c of await awaitPromises(...collisionPromises)) {
                collisions.push(c);
            }

            //console.timeEnd('s');

            gameObjects.forEach(gO => gO.rigidbody.update(this.gameTime, collisions));

            await awaitPromises(...gameObjects.map(gameObject => gameObject.update(this.gameTime, collisions)));
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

    /**
     * 
     * Start scene.
     * 
     */
    public async start(): Promise<void> {
        for (const gameObject of this.getAllGameObjects()) {
            await awaitPromises(...gameObject.getComponents<Behaviour>(ComponentType.Behaviour).map(b => b.start()));
        }

        this.requestAnimationFrameHandle = requestAnimationFrame(this.update.bind(this));
    }

    /**
     *
     * Stop scene.
     *
     */
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

    /**
     * 
     * Returns true if scene is running.
     * 
     */
    public get isRunning(): boolean {
        return typeof this.requestAnimationFrameHandle === 'number';
    }

    /**
     * 
     * Remove gameObject from scene.
     * 
     */
    public destroyGameObject(name: string) :void{
        this.gameObjects.delete(name);
    }
}
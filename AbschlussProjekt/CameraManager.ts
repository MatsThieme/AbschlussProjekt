import { AnimatedSprite } from './Components/AnimatedSprite.js';
import { Camera } from './Components/Camera.js';
import { CircleRenderer } from './Components/CircleRenderer.js';
import { ComponentType } from './Components/ComponentType.js';
import { ParticleSystem } from './Components/ParticleSystem.js';
import { PolygonRenderer } from './Components/PolygonRenderer.js';
import { Texture } from './Components/Texture.js';
import { TileMap } from './Components/TileMap.js';
import { Frame } from './Frame.js';
import { GameObject } from './GameObject.js';
import { Vector2 } from './Vector2.js';

export class CameraManager {
    private context: CanvasRenderingContext2D;
    public cameras: Camera[];
    public mainCameraIndex: number;
    public constructor(domElement: HTMLCanvasElement) {
        this.cameras = [];
        this.mainCameraIndex = 0;
        this.context = <CanvasRenderingContext2D>domElement.getContext('2d');
    }
    public get mainCamera(): Camera {
        return this.cameras[this.mainCameraIndex % this.cameras.length];
    }
    public update(gameObjects: GameObject[]) {
        this.mainCamera.resolution = new Vector2(this.context.canvas.width, this.context.canvas.height);

        let frames: (Frame | undefined)[] = [];

        for (const gameObject of gameObjects) {
            frames.push(...gameObject.getComponents<TileMap>(ComponentType.ParticleSystem).reduce((t: Frame[], c) => { t.push(...(<Frame[]>c.currentFrame)); return t; }, []));
            frames.push(...gameObject.getComponents<PolygonRenderer>(ComponentType.PolygonRenderer).map(pR => pR.currentFrame));
            frames.push(...gameObject.getComponents<CircleRenderer>(ComponentType.CircleRenderer).map(cR => cR.currentFrame));
            frames.push(...gameObject.getComponents<AnimatedSprite>(ComponentType.AnimatedSprite).map(aS => aS.currentFrame));
            frames.push(...gameObject.getComponents<Texture>(ComponentType.Texture).map(t => t.currentFrame));
            frames.push(...gameObject.getComponents<ParticleSystem>(ComponentType.ParticleSystem).reduce((t: Frame[], c) => { t.push(...(<Frame[]>c.currentFrame)); return t; }, []));
        }

        frames = frames.filter(f => f).sort((a, b) => <number>a?.drawPriority - <number>b?.drawPriority);

        this.cameras.forEach(camera => camera.update(<Frame[]>frames));


        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        this.context.drawImage(this.cameras[this.mainCameraIndex].currentFrame, 0, 0);


        // draw polygon vertices + lines

        //this.context.beginPath();

        //for (const gameObject of gameObjects) {
        //    if (gameObject.getComponent<PolygonCollider>(ComponentType.PolygonCollider)) {
        //        for (const collider of gameObject.getComponents<PolygonCollider>(ComponentType.PolygonCollider)) {

        //            for (const vertex of collider.vertices) {
        //                const pos = this.mainCamera.worldToScreenPoint(vertex);
        //                this.context.moveTo(pos.x + 5, pos.y);
        //                this.context.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
        //            }

        //            const rect = collider.AABB;

        //            this.context.strokeRect(this.mainCamera.worldToScreenPoint(rect.position).x, this.mainCamera.worldToScreenPoint(rect.position).y, this.mainCamera.worldToScreen(rect.size).x, this.mainCamera.worldToScreen(rect.size).y);
        //        }
        //    }
        //}

        //this.context.closePath();

        //this.context.strokeStyle = '#f00';
        //this.context.stroke();
    }
}
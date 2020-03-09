import { AnimatedSprite } from './Components/AnimatedSprite.js';
import { Camera } from './Components/Camera.js';
import { ParticleSystem } from './Components/ParticleSystem.js';
import { Texture } from './Components/Texture.js';
import { TileMap } from './Components/TileMap.js';
import { Frame } from './Frame.js';
import { GameObject } from './GameObject.js';
import { PolygonRenderer } from './Components/PolygonRenderer.js';
import { ComponentType } from './Components/ComponentType.js';
import { PolygonCollider } from './Components/PolygonCollider.js';

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
        let frames: (Frame | undefined)[] = [];

        for (const gameObject of gameObjects) {
            frames.push(...(gameObject.getComponent<TileMap>(ComponentType.TileMap)?.currentFrame || []));
            frames.push(...gameObject.getComponents<PolygonRenderer>(ComponentType.PolygonRenderer).map(pR => pR.currentFrame));
            frames.push(...gameObject.getComponents<AnimatedSprite>(ComponentType.AnimatedSprite).map(aS => aS.currentFrame));
            frames.push(...gameObject.getComponents<Texture>(ComponentType.Texture).map(t => t.currentFrame));
            frames.push(...gameObject.getComponents<ParticleSystem>(ComponentType.ParticleSystem).reduce((t: Frame[], c) => { t.push(...(<Frame[]>c.currentFrame)); return t; }, []));
        }

        frames = frames.filter(f => f).sort((a, b) => <number>a?.drawPriority - <number>b?.drawPriority);

        this.cameras.forEach(camera => camera.update(<Frame[]>frames));


        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.drawImage(this.cameras[this.mainCameraIndex].currentFrame, 0, 0);

        for (const gameObject of gameObjects) {
            if (gameObject.getComponent<PolygonCollider>(ComponentType.PolygonCollider)) {
                for (const vertex of gameObject.getComponent<PolygonCollider>(ComponentType.PolygonCollider).vertices) {
                    const pos = this.mainCamera.worldToScreenPoint(vertex);
                    this.context.moveTo(pos.x, pos.y);
                    this.context.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
                }
            }
        }

        this.context.strokeStyle = '#f00';
        this.context.stroke();
    }
}
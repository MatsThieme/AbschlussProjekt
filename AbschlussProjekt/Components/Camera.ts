import { Frame } from '../Frame.js';
import { GameObject } from '../GameObject.js';
import { AABB } from '../Physics/AABB.js';
import { Vector2 } from '../Vector2.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';

export class Camera extends Component {
    public resolution: Vector2;
    public size: Vector2;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    public constructor(gameObject: GameObject, resolution: Vector2 = new Vector2(1920, 1080), size: Vector2 = new Vector2(16, 9)) {
        super(gameObject, ComponentType.Camera);
        this.resolution = resolution;
        this.size = size;
        this.canvas = document.createElement('canvas');
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    }
    public get currentFrame(): HTMLCanvasElement {
        return <HTMLCanvasElement>this.canvas;
    }
    public update(frames: Frame[]) {
        this.canvas.width = this.resolution.x;
        this.canvas.height = this.resolution.y;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const frame of frames) {
            if (this.AABBInCamera(new AABB(frame.size, frame.worldCordinates))) {
                const framePos = this.worldToScreenPoint(frame.worldCordinates);
                const frameSize = this.worldToScreen(frame.size);
                this.context.drawImage(frame.sprite.image, framePos.x, framePos.y, frameSize.x, frameSize.y);
            }
        }
    }
    public AABBInCamera(rect: AABB): boolean {
        return rect.intersects(this.AABB);
    }
    public worldToScreenPoint(position: Vector2): Vector2 {
        const localPosition = position.clone.sub(this.gameObject.transform.position).add(this.size.clone.scale(0.5));

        return this.worldToScreen(localPosition);
    }
    public screenToWorldPoint(position: Vector2): Vector2 {
        return this.screenToWorld(position).add(this.gameObject.transform.position).sub(this.size.clone.scale(0.5));
    }
    public worldToScreen(vector: Vector2) {
        return new Vector2(vector.x / this.size.x * this.resolution.x, vector.y / this.size.y * this.resolution.y);
    }
    public screenToWorld(vector: Vector2) {
        return new Vector2(vector.x / this.resolution.x * this.size.x, vector.y / this.resolution.y * this.size.y);
    }
    private get AABB(): AABB {
        return new AABB(this.size, new Vector2(this.gameObject.transform.position.x - this.size.x / 2, this.gameObject.transform.position.y - this.size.y / 2));
    }
}
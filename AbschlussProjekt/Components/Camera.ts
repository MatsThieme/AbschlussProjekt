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
            if (this.rectInCamera(new AABB(frame.size, frame.worldCordinates))) {
                const framePos = this.worldToScreenPoint(frame.worldCordinates);
                this.context.drawImage(frame.sprite.image, framePos.x, framePos.y);
            }
        }
    }
    public rectInCamera(rect: AABB): boolean {
        return rect.intersects(this.AABB);

        //return rect.position.x < this.gameObject.transform.position.x + this.size.x / 2 && //rechts
        //    this.gameObject.transform.position.x - this.size.x / 2 < rect.position.x + rect.size.x && // links
        //    rect.position.y + rect.size.y > this.gameObject.transform.position.y + this.size.y / 2 && // oben
        //    rect.position.y < this.gameObject.transform.position.y + this.size.y / 2; // unten
    }
    public worldToScreenPoint(position: Vector2): Vector2 {
        const localPosition = position.clone.sub(this.gameObject.transform.position).add(this.size.clone.scale(0.5));

        return new Vector2(localPosition.x / this.size.x * this.resolution.x, localPosition.y / this.size.y * this.resolution.y);
    }
    public screenToWorldPoint(position: Vector2): Vector2 {
        return new Vector2(position.x / this.resolution.x * this.size.x, position.y / this.resolution.y * this.size.y).add(this.gameObject.transform.position).sub(this.size.clone.scale(0.5));
    }
    private get AABB(): AABB {
        return new AABB(this.size, new Vector2(this.gameObject.transform.position.x - this.size.x / 2, this.gameObject.transform.position.y - this.size.y / 2));
    }
}
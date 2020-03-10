import { Frame } from '../Frame.js';
import { GameObject } from '../GameObject.js';
import { Sprite } from '../Sprite.js';
import { Vector2 } from '../Vector2.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';
import { PolygonCollider } from './PolygonCollider.js';

export class PolygonRenderer extends Component {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private polygonCollider: PolygonCollider;
    private sprite: Sprite;
    private _position: Vector2;
    private size: Vector2;
    public constructor(gameObject: GameObject) {
        super(gameObject, ComponentType.PolygonRenderer);

        this.polygonCollider = this.gameObject.getComponent(PolygonCollider);

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.polygonCollider.size.x * 1000;
        this.canvas.height = this.polygonCollider.size.y * 1000;
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');


        this.context.fillStyle = '#' + (~~(0xdddddd * Math.random()) + 0x111111).toString(16);
        this.context.translate(0, this.canvas.height);
        this.context.scale(1 * this.gameObject.transform.relativeScale.x, -1 * this.gameObject.transform.relativeScale.y);

        this.context.beginPath();

        const topLeft = new Vector2(Infinity, -Infinity);

        const vs = this.polygonCollider.vertices;

        for (const vertex of vs) {
            if (vertex.x < topLeft.x) topLeft.x = vertex.x;
            if (vertex.y > topLeft.y) topLeft.y = vertex.y;
        }

        const center = topLeft.clone.add(new Vector2(this.polygonCollider.size.x / 2, -this.polygonCollider.size.y / 2));

        for (const vertex of vs.map(v => v.sub(center))) {
            this.context.lineTo(this.canvas.width / 2 + vertex.x / this.polygonCollider.size.x * this.canvas.width, this.canvas.height / 2 + vertex.y / this.polygonCollider.size.y * this.canvas.height);
        }

        this.context.closePath();
        this.context.fill();

        this.sprite = new Sprite(this.canvas);

        this.size = this.polygonCollider.scaledSize;
        this._position = new Vector2(topLeft.x, topLeft.y - this.polygonCollider.size.y).sub(this.gameObject.transform.position);
    }
    private get position(): Vector2 {
        return this._position.clone.add(this.polygonCollider.position).sub(this.polygonCollider.relativePosition);
    }
    public get currentFrame(): Frame | undefined {
        return new Frame(this.position, this.size, this.sprite, this.gameObject.transform.rotation, this.gameObject.drawPriority, 1, this.polygonCollider.position);
    }
}
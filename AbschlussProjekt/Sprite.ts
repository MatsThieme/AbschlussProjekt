import { Vector2 } from './Vector2.js';

export class Sprite {
    public image: HTMLImageElement;
    public size: Vector2;
    public constructor(src: string | HTMLCanvasElement) {
        this.image = new Image();

        this.image.src = (typeof src === 'string' ? '/Assets/' + src : src.toDataURL());

        this.size = new Vector2(this.image.width, this.image.height);
    }
}
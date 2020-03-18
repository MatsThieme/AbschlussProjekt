import { Settings } from './Settings.js';
import { Vector2 } from './Vector2.js';

export class Sprite {
    public image: HTMLImageElement;
    public size: Vector2;
    public constructor(src: string | HTMLCanvasElement | ((context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => any)) {
        this.image = new Image();

        if (typeof src === 'string') {
            this.image.src = Settings.assetPath + src;
        } else if ('toDataURL' in src) {
            this.image.src = src.toDataURL();
        } else {
            const canvas = document.createElement('canvas');
            const context = <CanvasRenderingContext2D>canvas.getContext('2d');

            src(context, canvas);
            this.image.src = canvas.toDataURL();
        }

        this.size = new Vector2(this.image.width, this.image.height);
    }
}
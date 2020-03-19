import { Settings } from './Settings.js';
import { Vector2 } from './Vector2.js';

export class Sprite {
    public canvasImageSource!: CanvasImageSource;
    public size: Vector2;
    public constructor(src: string | HTMLCanvasElement | OffscreenCanvas | HTMLImageElement | ((context: OffscreenCanvasRenderingContext2D, canvas: OffscreenCanvas) => any)) {
        if (typeof src === 'string') {
            this.canvasImageSource = new Image();
            this.canvasImageSource.src = Settings.assetPath + src;
        } else if (src instanceof OffscreenCanvas || src instanceof HTMLCanvasElement) {
            this.canvasImageSource = src;
        } else if (src instanceof Image) {
            this.canvasImageSource = src;
        } else {
            const canvas = new OffscreenCanvas(0, 0);
            const context = <OffscreenCanvasRenderingContext2D>canvas.getContext('2d');

            src(context, canvas);
            this.canvasImageSource = canvas;
        }

        this.size = new Vector2(this.canvasImageSource.width, this.canvasImageSource.height);
    }
}
import { Settings } from './Settings.js';
import { Vector2 } from './Vector2.js';

export class Sprite {
    public canvasImageSource!: HTMLCanvasElement | OffscreenCanvas | HTMLImageElement;
    public size: Vector2;
    public constructor(src: string | HTMLCanvasElement | OffscreenCanvas | HTMLImageElement | ((context: OffscreenCanvasRenderingContext2D, canvas: OffscreenCanvas) => any)) {
        if (typeof src === 'string') {
            this.canvasImageSource = new Image();
            this.canvasImageSource.src = src.substr(0, 'http://'.length) === 'http://' || src.substr(0, 'https://'.length) === 'https://' ? src : Settings.assetPath + src;
        } else if (src instanceof HTMLCanvasElement || (OffscreenCanvas && src instanceof OffscreenCanvas)) {
            this.canvasImageSource = src;
        } else if (src instanceof Image) {
            this.canvasImageSource = src;
        } else if (typeof src === 'function') {
            const canvas = new OffscreenCanvas(1, 1);
            const context = <OffscreenCanvasRenderingContext2D>canvas.getContext('2d');

            src(context, canvas);

            this.canvasImageSource = canvas;
        }

        this.size = new Vector2(this.canvasImageSource.width, this.canvasImageSource.height);
    }
}
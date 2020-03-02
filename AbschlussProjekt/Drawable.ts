import { Sprite } from './Resources/Sprite.js';
import { Vector2 } from './Vector2.js';

export interface Drawable {
    readonly currentFrame: Frame;
}

export class Frame {
    public readonly worldCordinates: Vector2;
    public readonly sprite: HTMLCanvasElement | Sprite;
    public constructor(worldCordinates: Vector2, canvas: HTMLCanvasElement | Sprite) {
        this.worldCordinates = worldCordinates;
        this.sprite = canvas;
    }
}
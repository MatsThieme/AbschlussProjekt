import { Sprite } from './Resources/Sprite.js';
import { Vector2 } from './Vector2.js';

export class Frame {
    public readonly worldCordinates: Vector2;
    public readonly sprite: Sprite;
    public readonly size: Vector2;
    public constructor(worldCordinates: Vector2, size: Vector2, canvas: Sprite) {
        this.worldCordinates = worldCordinates;
        this.sprite = canvas;
        this.size = size;
    }
}
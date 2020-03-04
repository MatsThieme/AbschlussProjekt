import { Sprite } from './Sprite.js';
import { Vector2 } from './Vector2.js';
import { Angle } from './Angle.js';

export class Frame {
    public readonly worldCordinates: Vector2;
    public readonly sprite: Sprite;
    public readonly size: Vector2;
    public readonly rotation: Angle;
    public readonly drawPriority: number;
    public constructor(worldCordinates: Vector2, size: Vector2, sprite: Sprite, rotation: Angle, drawPriority: number) {
        this.worldCordinates = worldCordinates;
        this.sprite = sprite;
        this.size = size;
        this.rotation = rotation;
        this.drawPriority = drawPriority;
    }
}
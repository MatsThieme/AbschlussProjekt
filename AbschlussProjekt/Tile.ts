import { Sprite } from './Sprite.js';
import { SpriteAnimation } from './SpriteAnimation.js';

export class Tile {
    public sprite: Sprite | SpriteAnimation;
    public collide: boolean;
    public constructor(sprite: Sprite | SpriteAnimation, collide: boolean = true) {
        this.sprite = sprite;
        this.collide = collide;
    }
}
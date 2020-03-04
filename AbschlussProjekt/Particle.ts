import { GameTime } from './GameTime.js';
import { Sprite } from './Sprite.js';
import { SpriteAnimation } from './SpriteAnimation.js';
import { Vector2 } from './Vector2.js';

export class Particle {
    public relativePosition: Vector2;
    public velocity: Vector2;
    public sprite: Sprite | SpriteAnimation;
    public startTime: number;
    public constructor(sprite: Sprite | SpriteAnimation, velocity: Vector2 = new Vector2()) {
        this.relativePosition = new Vector2();
        this.velocity = velocity;
        this.sprite = sprite;
        this.startTime = performance.now();
    }
    public update(gameTime: GameTime) {
        this.relativePosition.add(this.velocity.clone.scale(gameTime.deltaTime));
        if (this.sprite instanceof SpriteAnimation) this.sprite.update(gameTime);
    }
}
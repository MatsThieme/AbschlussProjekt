import { ParticleSystem } from './Components/ParticleSystem.js';
import { Drawable } from './Drawable.js';
import { Frame } from './Frame.js';
import { GameTime } from './GameTime.js';
import { Sprite } from './Sprite.js';
import { SpriteAnimation } from './SpriteAnimation.js';
import { Vector2 } from './Vector2.js';
import { Angle } from './Angle.js';

export class Particle implements Drawable {
    public relativePosition: Vector2;
    public rotation: Angle;
    public velocity: Vector2;
    public sprite: Sprite | SpriteAnimation;
    public startTime: number;
    public particleSystem: ParticleSystem;
    public constructor(particleSystem: ParticleSystem, sprite: Sprite | SpriteAnimation, velocity: Vector2 = new Vector2()) {
        this.relativePosition = new Vector2();
        this.velocity = velocity;
        this.sprite = sprite;
        this.startTime = performance.now();
        this.particleSystem = particleSystem;
        this.rotation = new Angle(undefined, Math.random() * 360);
    }
    public get size(): Vector2 {
        return this.particleSystem.size;
    }
    public get scaledSize(): Vector2 {
        return this.particleSystem.scaledSize;
    }
    public get currentFrame(): Frame {
        return new Frame(this.position, this.scaledSize, this.sprite instanceof SpriteAnimation ? this.sprite.currentFrame : this.sprite, new Angle(this.particleSystem.gameObject.transform.rotation.radian + this.rotation.radian), this.particleSystem.gameObject.drawPriority, this.alpha);
    }
    public get position(): Vector2 {
        return this.particleSystem.position.clone.add(this.relativePosition);
    }
    public update(gameTime: GameTime) {
        this.rotation.degree += 360 / 1000 * gameTime.deltaTime * this.particleSystem.rotationSpeed;
        this.relativePosition.add(this.velocity.clone.scale(gameTime.deltaTime));
        if (this.sprite instanceof SpriteAnimation) this.sprite.update(gameTime);
    }
    public get alpha(): number {
        if (performance.now() < this.startTime + this.particleSystem.fadeInDuration && this.particleSystem.fadeInDuration > 0) {
            return (performance.now() - this.startTime) / this.particleSystem.fadeInDuration;
        } else if (performance.now() > this.startTime + this.particleSystem.lifeTime - this.particleSystem.fadeOutDuration && this.particleSystem.fadeOutDuration > 0) {
            return 1 - (performance.now() - this.startTime - this.particleSystem.lifeTime + this.particleSystem.fadeOutDuration) / this.particleSystem.fadeOutDuration;
        }

        return 1;
    }
}
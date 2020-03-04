import { AlignH, AlignV } from '../Align.js';
import { Alignable } from '../Alignable.js';
import { Angle } from '../Angle.js';
import { Drawable } from '../Drawable.js';
import { Frame } from '../Frame.js';
import { GameObject } from '../GameObject.js';
import { GameTime } from '../GameTime.js';
import { Particle } from '../Particle.js';
import { Sprite } from '../Sprite.js';
import { SpriteAnimation } from '../SpriteAnimation.js';
import { Vector2 } from '../Vector2.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';

export class ParticleSystem extends Component implements Drawable, Alignable {
    public distance: number;
    public angle: Angle;
    public sprites: (Sprite | SpriteAnimation)[];
    public relativePosition: Vector2;
    public size: Vector2;
    public alignH: AlignH;
    public alignV: AlignV;
    public emission: number;
    public speed: number;
    private particles: Particle[];
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private timer: number;
    public particleLifeTime: number;
    public constructor(gameObject: GameObject, distance: number = 1, angle: Angle = new Angle(), sprites: (Sprite | SpriteAnimation)[] = [], emission: number = 100, speed: number = 0, particleLifeTime: number = 500, relativePosition: Vector2 = new Vector2(), size: Vector2 = new Vector2(1, 1), alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, ComponentType.ParticleSystem);
        this.distance = distance;
        this.angle = angle;
        this.sprites = sprites;
        this.relativePosition = relativePosition;
        this.size = size;
        this.alignH = alignH;
        this.alignV = alignV;
        this.emission = emission;
        this.speed = speed;
        this.particleLifeTime = particleLifeTime;

        this.particles = [];
        this.timer = 0;

        this.canvas = document.createElement('canvas');
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    }
    public get currentFrame(): Frame | undefined {
        return new Frame(this.position, this.scaledSize, new Sprite(this.canvas), this.gameObject.transform.rotation, this.gameObject.drawPriority);
    }
    public update(gameTime: GameTime) {
        this.timer += gameTime.deltaTime;

        if (this.timer >= this.emission) {
            this.particles.push(new Particle(this.sprites[~~(Math.random() * this.sprites.length)], new Angle(Math.random() * this.angle.radian + this.gameObject.transform.rotation.radian).toVector2().scale(this.speed)));
            this.timer %= this.emission;
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const pos = Vector2.add(this.position, this.relativePosition, this.particles[i].relativePosition);
            this.context.drawImage(this.particles[i].sprite instanceof Sprite ? (<Sprite>this.particles[i].sprite).image : (<SpriteAnimation>this.particles[i].sprite).currentFrame.image, pos.x, pos.y);
            this.particles[i].update(gameTime);
            //if (this.particles[i].startTime + this.particleLifeTime < gameTime.now) this.particles.splice(i, 1);
        }
    }
    public get scaledSize(): Vector2 {
        return new Vector2(this.size.x * this.gameObject.transform.scale.x, this.size.y * this.gameObject.transform.scale.y);
    }
    public get position() {
        const align = new Vector2(this.alignH === AlignH.Left ? -this.scaledSize.x : this.alignH === AlignH.Center ? -this.scaledSize.x / 2 : 0, this.alignV === AlignV.Bottom ? -this.scaledSize.y : this.alignV === AlignV.Center ? -this.scaledSize.y / 2 : 0);
        return Vector2.add(this.relativePosition, this.gameObject.transform.position, align);
    }
}
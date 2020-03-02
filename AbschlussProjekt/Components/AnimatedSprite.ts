import { Drawable } from '../Drawable.js';
import { Frame } from '../Frame.js';
import { GameObject } from '../GameObject.js';
import { GameTime } from '../GameTime.js';
import { SpriteAnimation } from '../SpriteAnimation.js';
import { Vector2 } from '../Vector2.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';

export class AnimatedSprite extends Component implements Drawable {
    public spriteAnimations: SpriteAnimation[];
    public msbetweenSwitch: number;
    private _activeAnimation: number;
    public relativePosition: Vector2;
    public size: Vector2;
    public constructor(gameObject: GameObject, spriteAnimations: SpriteAnimation[] = [], relativePosition: Vector2 = new Vector2(), size: Vector2 = new Vector2()) {
        super(gameObject, ComponentType.AnimatedSprite);
        this.spriteAnimations = spriteAnimations;
        this.msbetweenSwitch = this._activeAnimation = 0;
        this.relativePosition = relativePosition;
        this.size = size;
    }
    public get currentFrame(): Frame {
        return new Frame(this.gameObject.transform.position.clone.add(this.relativePosition), this.size, this.spriteAnimations[this._activeAnimation].getFrame);
    }
    public update(gameTime: GameTime) {
        if (this.spriteAnimations.length === 0) console.error('spriteAnimations empty, gameObject name:', this.gameObject.name);
        this.spriteAnimations[this._activeAnimation].update(gameTime);
    }
    public set activeAnimation(val: number) {
        this._activeAnimation = val % this.spriteAnimations.length;
        this.spriteAnimations[this._activeAnimation].reset();
    }
}
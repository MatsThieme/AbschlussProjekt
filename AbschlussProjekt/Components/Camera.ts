import { Vector2 } from '../Vector2.js';
import { Component } from './Component.js';
import { GameObject } from '../GameObject.js';
import { ComponentType } from './ComponentType.js';

export class Camera extends Component {
    public resolution: Vector2;
    private _currentFrame: HTMLImageElement | undefined;
    public constructor(gameObject: GameObject, resolution: Vector2 = new Vector2(1920, 1080)) {
        super(gameObject, ComponentType.Camera);
        this.resolution = resolution;
    }
    public get currentFrame(): HTMLImageElement {
        return <HTMLImageElement>this._currentFrame;
    }
}
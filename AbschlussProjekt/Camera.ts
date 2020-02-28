import { Vector2 } from './Vector2.js';

export class Camera {
    public resolution: Vector2;
    public _currentFrame: any;
    public constructor(resolution: Vector2 = new Vector2(1920, 1080)) {
        this.resolution = resolution;
    }
    public get currentFrame(): any {
        return this._currentFrame;
    }
}
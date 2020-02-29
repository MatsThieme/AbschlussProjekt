import { Vector2 } from './Vector2.js';

export class Camera {
    public position: Vector2;
    public rotation: number;
    public resolution: Vector2;
    private _currentFrame: HTMLImageElement | undefined;
    public constructor(resolution: Vector2 = new Vector2(1920, 1080)) {
        this.resolution = resolution;
        this.position = new Vector2();
        this.rotation = 0;
    }
    public get currentFrame(): HTMLImageElement {
        return <HTMLImageElement>this._currentFrame;
    }
}
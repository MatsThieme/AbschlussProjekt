import { Vector2 } from '../Vector2.js';
import { InputAxis } from './InputAxis.js';
import { InputButton } from './InputButton.js';

export class InputTouch {
    private _position: Vector2;
    private _positions: Vector2[];
    private button: InputButton;
    public constructor(domElement: HTMLCanvasElement) {
        this.button = new InputButton();
        this._positions = [];
        this._position = new Vector2();

        domElement.addEventListener('touchstart', this.onTouchStart.bind(this));
        domElement.addEventListener('touchend', this.onTouchEnd.bind(this));
        domElement.addEventListener('touchmove', this.onTouchMove.bind(this));
    }
    private onTouchMove(e: TouchEvent): void {
        e.preventDefault();

        for (let i = 0; i < e.touches.length; i++) {
            const item = e.touches.item(i)!;
            this._positions[i] = new Vector2(item.clientX * window.devicePixelRatio, item.clientY * window.devicePixelRatio).round();
        }

        this._position = this._positions[0] || this._position;
    }
    private onTouchEnd(e: TouchEvent): void {
        e.preventDefault();

        this._positions = [];

        for (let i = 0; i < e.touches.length; i++) {
            const item = e.touches.item(i)!;
            this._positions[i] = new Vector2(item.clientX * window.devicePixelRatio, item.clientY * window.devicePixelRatio).round();
        }

        this._position = this._positions[0] || this._position;

        this.button.down = !!e.touches.length;
    }
    private onTouchStart(e: TouchEvent): void {
        e.preventDefault();

        for (let i = 0; i < e.touches.length; i++) {
            const item = e.touches.item(i)!;
            this._positions[i] = new Vector2(item.clientX * window.devicePixelRatio, item.clientY * window.devicePixelRatio).round();
        }

        this._position = this._positions[0] || this._position;

        this.button.down = !!e.touches.length;
    }
    public getButton(index: number): InputButton {
        return index === 0 ? this.button : new InputButton();
    }
    public getAxis(index: number): InputAxis {
        return index < this._positions.length ? new InputAxis([this._positions[index].x, this._positions[index].y]) : new InputAxis();
    }
    public update(): void {
        this.button.update();
    }
}
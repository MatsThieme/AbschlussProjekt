import { GameTime } from '../GameTime.js';
import { Vector2 } from '../Vector2.js';
import { InputAxis } from './InputAxis.js';
import { InputButton } from './InputButton.js';

export class InputMouse {
    private _acceleration: { vec: Vector2, time: number }[];
    private _position: Vector2;
    private buttons: InputButton[];
    private gameTime: GameTime;
    public constructor(gameTime: GameTime) {
        this.gameTime = gameTime;
        this.buttons = [new InputButton(), new InputButton(), new InputButton()];
        this._acceleration = [];
        this._position = new Vector2();

        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('contextmenu', e => e.preventDefault());
    }
    private onMouseMove(e: MouseEvent): void {
        e.preventDefault();
        this._position.x = e.clientX;
        this._position.y = e.clientY;
        this._acceleration.push({ vec: new Vector2(e.movementX, e.movementY), time: this.gameTime.now });
    }
    private onMouseUp(e: MouseEvent): void {
        e.preventDefault();
        this._position.x = e.clientX;
        this._position.y = e.clientY;

        this.buttons[e.button].down = false;
    }
    private onMouseDown(e: MouseEvent): void {
        e.preventDefault();
        this._position.x = e.clientX;
        this._position.y = e.clientY;

        this.buttons[e.button].down = true;
    }
    public getButton(index: number): InputButton {
        return this.buttons[index];
    }
    public getAxis(index: number): InputAxis {
        return new InputAxis([this._position.x, this._position.y, this.acceleration.x, this.acceleration.y][index]);
    }
    private get acceleration(): Vector2 {
        this._acceleration = this._acceleration.filter(e => this.gameTime.now - e.time <= this.gameTime.deltaTime);
        return this._acceleration.reduce((a, b) => ({ vec: new Vector2(a.vec.x + b.vec.x, a.vec.y + b.vec.y) }), { vec: new Vector2() }).vec;
    }
    public update(): void {
        this.buttons.forEach(b => b.update());
    }
}
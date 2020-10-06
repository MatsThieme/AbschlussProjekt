import { ProjectSettings } from '../ProjectSettings.js';
import { Vector2 } from '../Vector2.js';
import { InputAxis } from './InputAxis.js';
import { InputButton } from './InputButton.js';

export class InputMouse {
    /**
     * 
     * Pointer position relative to the scene domelement position.
     * 
     */
    private _position: Vector2;
    private buttons: InputButton[];
    public constructor(domElement: HTMLCanvasElement) {
        this.buttons = [];
        this._position = new Vector2();

        domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
        domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
        domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        if (!ProjectSettings.allowContextMenu) domElement.addEventListener('contextmenu', e => e.preventDefault());
    }
    private onMouseMove(e: MouseEvent): void {
        e.preventDefault();
        this._position.set(e.clientX * window.devicePixelRatio, e.clientY * window.devicePixelRatio).round();
    }
    private onMouseUp(e: MouseEvent): void {
        e.preventDefault();
        this._position.set(e.clientX * window.devicePixelRatio, e.clientY * window.devicePixelRatio).round();

        this.buttons[e.button].down = false;
    }
    private onMouseDown(e: MouseEvent): void {
        e.preventDefault();
        this._position.set(e.clientX * window.devicePixelRatio, e.clientY * window.devicePixelRatio).round();

        if (!this.buttons[e.button]) this.buttons[e.button] = new InputButton();

        this.buttons[e.button].down = true;
    }
    public getButton(index: number): InputButton {
        return this.buttons[index] || new InputButton();
    }
    public getAxis(index: number): InputAxis {
        return index === 0 ? new InputAxis([this._position.x, this._position.y]) : new InputAxis();
    }
    public update(): void {
        this.buttons.forEach(b => b.update());
    }
}
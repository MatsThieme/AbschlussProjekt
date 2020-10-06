import { InputAxis } from './InputAxis.js';
import { InputButton } from './InputButton.js';

export class InputGamepad {
    private buttons: InputButton[];
    public constructor() {
        this.buttons = new Array(16).fill(undefined).map(() => new InputButton());
    }
    private get gamepads(): Gamepad[] {
        return [...<Gamepad[]>navigator.getGamepads()].filter(g => g?.mapping === 'standard');
    }
    public getButton(b: number): InputButton {
        if (typeof b !== 'number') return new InputButton();
        if (this.gamepads.findIndex(g => g.buttons[b].pressed) !== -1) this.buttons[b].down = true;
        else this.buttons[b].down = false;
        return this.buttons[b];
    }
    public getAxis(a: number): InputAxis {
        return this.gamepads.length && this.gamepads[0].axes.length > a ? new InputAxis(this.gamepads.map(g => g.axes[a]).sort((a, b) => a - b)[0]) : new InputAxis();
    }
    public update(): void {
        this.buttons.forEach(b => b.update());
    }
}
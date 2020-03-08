import { GameTime } from '../GameTime.js';
import { InputAxis } from './InputAxis.js';
import { InputButton } from './InputButton.js';

export class InputGamepad {
    private gameTime: GameTime;
    private buttons: InputButton[];
    public constructor(gameTime: GameTime) {
        this.gameTime = gameTime;
        this.buttons = new Array(16).fill(undefined).map(() => new InputButton(this.gameTime));
    }
    private get gamepads(): Gamepad[] {
        return [...<Gamepad[]>navigator.getGamepads()].filter(g => g?.mapping === 'standard');
    }
    public getButton(b: number): InputButton {
        console.log(b);
        if (this.gamepads.findIndex(g => g.buttons[b].pressed) != -1) this.buttons[b].down = true;
        else this.buttons[b].down = false;
        return this.buttons[b];
    }
    public getAxis(a: number): InputAxis {
        return new InputAxis(this.gamepads.map(g => g.axes[a]).sort((a, b) => a - b)[0]);
    }
}
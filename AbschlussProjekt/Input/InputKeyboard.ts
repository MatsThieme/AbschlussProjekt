import { InputAxis } from './InputAxis.js';
import { InputButton } from './InputButton.js';
import { GameTime } from '../GameTime.js';

export class InputKeyboard {
    private keys: Map<string, InputButton>;
    private gameTime: GameTime;
    public constructor(gameTime: GameTime) {
        this.keys = new Map();
        (<InputButton[]>[]).fill(new InputButton(gameTime), 0, 222);
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));

        this.gameTime = gameTime;
    }
    private onKeyDown(e: KeyboardEvent): void {
        console.log(e.code);
        let btn = <InputButton>this.keys.get(e.code);
        if (!btn) btn = new InputButton(this.gameTime);
        btn.down = true;
        this.keys.set(e.code, btn);
    }
    private onKeyUp(e: KeyboardEvent): void {
        let btn = <InputButton>this.keys.get(e.code);
        if (!btn) btn = new InputButton(this.gameTime);
        btn.down = false;
        this.keys.set(e.code, btn);
    }
    public getButton(key: string): InputButton {
        if (!this.keys.get(key)) this.keys.set(key, new InputButton(this.gameTime));
        return <InputButton>this.keys.get(key);
    }
    public getAxis(key: string): InputAxis {
        let match = <RegExpMatchArray>key.match(/^ToAxis\((\w*)\W*(\w*)\)$/);
        if (match.length === 3 && this.getButton(match[1]) && this.getButton(match[2])) return new InputAxis((this.getButton(match[1]).down ? -1 : 0) + (this.getButton(match[2]).down ? 1 : 0));
        else return new InputAxis();
    }
}
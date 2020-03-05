import { GameTime } from '../GameTime.js';

export class InputButton {
    private _down: boolean;
    private firstdown: number;
    private gameTime: GameTime;
    public constructor(gameTime: GameTime) {
        this._down = false;
        this.firstdown = 0;
        this.gameTime = gameTime;
    }
    public set down(down: boolean) {
        if (down && this.firstdown == 0) this.firstdown = this.gameTime.now;
        else if (!down) this.firstdown = 0;
        this._down = down;
    }
    public get down(): boolean {
        return this._down;
    }
    public get clicked(): boolean {
        return this._down && this.gameTime.now - this.firstdown >= this.gameTime.deltaTime;
    }
}
export class InputMapping {
    [key: string]: any;
    public keyboard: { [key: number]: string };
    public mouse: { [key: number]: string | number };
    public gamepad: { [key: number]: string | number };
    public constructor(path?: string) {
        this.keyboard = {};
        this.mouse = {};
        this.gamepad = {};
        if (path) this.load(path);
    }
    public async load(path: string): Promise<void> {
        const result = await fetch('/Assets/' + path);
        const text = await result.text();
        Object.assign(this, JSON.parse(text));
    }
    public serialize(): string {
        return JSON.stringify(this);
    }
}
import { GameTime } from '../GameTime.js';
import { Input } from '../Input/Input.js';
import { AABB } from '../Physics/AABB.js';
import { Sprite } from '../Sprite.js';
import { UIMenu } from './UIMenu.js';
import { UIFrame } from './UIFrame.js';

export class UI {
    private menus: Map<string, UIMenu>;
    private input: Input;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    public aabb: AABB;
    public constructor(input: Input, aabb: AABB) {
        this.menus = new Map();
        this.input = input;
        this.canvas = document.createElement('canvas');
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.aabb = aabb;
    }
    public addMenu(name: string, cb?: (menu: UIMenu) => any): UIMenu {
        if (this.menus.has(name)) return <UIMenu>this.menus.get(name);

        const menu = new UIMenu(this.input);
        this.menus.set(name, menu);
        if (cb) cb(menu);

        return menu;
    }
    public update(gameTime: GameTime): void {
        this.canvas.width = this.aabb.size.x;
        this.canvas.height = this.aabb.size.y;
        this.context.clearRect(0, 0, this.aabb.size.x, this.aabb.size.y);

        for (const menu of this.menus.values()) {
            if (menu.active) {
                menu.update(gameTime);
                this.context.drawImage(menu.currentFrame.sprite.image, menu.aabb.position.x, menu.aabb.position.y, menu.aabb.size.x, menu.aabb.size.y);
            }
        }
    }
    public get currentFrame(): UIFrame {
        return new UIFrame(this.aabb, new Sprite(this.canvas));
    }
}
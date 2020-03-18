import { GameTime } from '../GameTime.js';
import { Input } from '../Input/Input.js';
import { AABB } from '../Physics/AABB.js';
import { Sprite } from '../Sprite.js';
import { Vector2 } from '../Vector2.js';
import { UIElement } from './UIElements/UIElement.js';
import { UIFrame } from './UIFrame.js';
import { UIFont } from './UIFont.js';

export class UIMenu {
    public active: boolean;
    public drawPriority: number;
    private uiElements: UIElement[];
    public aabb: AABB;
    private input: Input;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    public font: UIFont;
    public constructor(input: Input) {
        this.active = false;
        this.drawPriority = 0;
        this.uiElements = [];
        this.aabb = new AABB(new Vector2(0, 0), new Vector2(1920, 1080));
        this.input = input;

        this.canvas = document.createElement('canvas');
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');

        this.font = new UIFont(this);
    }
    public addUIElement<T extends UIElement>(type: new (menu: UIMenu, input: Input) => T, cb?: (uiElement: T) => any): T {
        const e = new type(this, this.input);
        if (cb) cb(e);
        this.uiElements.push(e);
        return e;
    }
    public get currentFrame(): UIFrame {
        this.canvas.width = this.aabb.size.x;
        this.canvas.height = this.aabb.size.y;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const uiElement of this.uiElements) {
            const f = uiElement.currentFrame;
            this.context.drawImage(f.sprite.image, f.aabb.position.x, f.aabb.position.y, f.aabb.size.x, f.aabb.size.y);
        }

        return new UIFrame(this.aabb, new Sprite(this.canvas));
    }
    public update(gameTime: GameTime): void {
        for (const uiElement of this.uiElements) {
            uiElement.update(gameTime);
        }
    }
}
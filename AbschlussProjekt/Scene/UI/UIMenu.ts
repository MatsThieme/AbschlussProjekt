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
    public pauseScene: boolean;
    public drawPriority: number;
    private uiElements: UIElement[];
    public aabb: AABB;
    private input: Input;
    private canvas: OffscreenCanvas;
    private context: OffscreenCanvasRenderingContext2D;
    public font: UIFont;
    public background?: Sprite;
    private frame!: UIFrame;
    public constructor(input: Input) {
        this.active = false;
        this.pauseScene = true;
        this.drawPriority = 0;
        this.uiElements = [];
        this.aabb = new AABB(new Vector2(1920, 1080), new Vector2(0, 0));
        this.input = input;

        this.canvas = new OffscreenCanvas(this.aabb.size.x, this.aabb.size.y);
        this.context = <OffscreenCanvasRenderingContext2D>this.canvas.getContext('2d');

        this.font = new UIFont(this);
    }
    public addUIElement<T extends UIElement>(type: new (menu: UIMenu, input: Input) => T, cb?: (uiElement: T) => any): T {
        const e = new type(this, this.input);
        if (cb) cb(e);
        e.start();
        this.uiElements.push(e);
        return e;
    }
    public get currentFrame(): UIFrame {
        return this.frame;
    }
    public update(gameTime: GameTime): void {
        this.canvas.width = this.aabb.size.x;
        this.canvas.height = this.aabb.size.y;

        if (this.background) this.context.drawImage(this.background.canvasImageSource, 0, 0, this.background.size.x, this.background.size.y);
        else this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const uiElement of this.uiElements) {
            uiElement.update(gameTime);

            const { sprite, aabb } = uiElement.currentFrame;
            this.context.drawImage(sprite.canvasImageSource, aabb.position.x, aabb.position.y, aabb.size.x, aabb.size.y);
        }

        this.frame = new UIFrame(this.aabb, new Sprite(this.canvas));
    }
}
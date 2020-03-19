import { GameTime } from '../../GameTime.js';
import { Input } from '../../Input/Input.js';
import { AABB } from '../../Physics/AABB.js';
import { Sprite } from '../../Sprite.js';
import { Vector2 } from '../../Vector2.js';
import { UIElementType } from '../UIElementType.js';
import { UIFrame } from '../UIFrame.js';
import { UIMenu } from '../UIMenu.js';
import { UIButton } from './UIButton.js';
import { UIElement } from './UIElement.js';
import { AlignH, AlignV } from '../../GameObject/Align.js';

export class UIDropdown extends UIElement {
    private _values: string[];
    private uiButtons: UIButton[];
    private activeIndex: number;
    public extendUpward: boolean;
    public constructor(menu: UIMenu, input: Input) {
        super(menu, input, UIElementType.Dropdown);

        this._values = [];
        this.uiButtons = [];
        this.activeIndex = 0;
        this.extendUpward = false;
    }
    public update(gameTime: GameTime): void {
        super.update(gameTime);

        if (this.click) {
            //if (this.cbOnInput) this.cbOnInput(this);
            this.sprite = new Sprite(this.draw.bind(this));
        }

        this.sprite = new Sprite(this.draw.bind(this));
    }
    protected draw(context: OffscreenCanvasRenderingContext2D, canvas: OffscreenCanvas): void {
        canvas.width = this.aabb.size.x;
        canvas.height = this.aabb.size.y;

        for (const button of this.uiButtons) {
            //console.log(button.currentFrame);
            context.drawImage(button.currentFrame.sprite.canvasImageSource, button.currentFrame.aabb.position.x, button.currentFrame.aabb.position.y, this._aabb.size.x, this._aabb.size.y / this.uiButtons.length);
        }

    }
    public get currentFrame(): UIFrame {
        return new UIFrame(this.aabb, this.sprite || new Sprite(() => { }));
    }
    public get values(): string[] {
        return this._values;
    }
    public set values(val: string[]) {
        this._values = val;
        this.uiButtons = [];

        const buttonSize = new Vector2(this.aabb.size.x, this.aabb.size.y / val.length).round();

        if (this.extendUpward) val.reverse();

        for (let i = 0; i < val.length; i++) {
            const button = new UIButton(this.menu, this.input);
            button.localAlignH = AlignH.Left;
            button.localAlignV = AlignV.Top;
            button.label = val[i];
            button.cbOnInput = b => console.log(this);

            button.aabb = new AABB(buttonSize, new Vector2(0, i * buttonSize.y));
            console.log(i * buttonSize.y);
            this.uiButtons.push(button);
        }

        if (this.extendUpward) val.reverse();
    }
    public get value(): string {
        return this._values[this.activeIndex];
    }
}
import { AlignH, AlignV } from '../../GameObject/Align.js';
import { GameTime } from '../../GameTime.js';
import { Input } from '../../Input/Input.js';
import { InputType } from '../../Input/InputType.js';
import { AABB } from '../../Physics/AABB.js';
import { Sprite } from '../../Sprite.js';
import { Vector2 } from '../../Vector2.js';
import { UIElementType } from '../UIElementType.js';
import { UIFrame } from '../UIFrame.js';
import { UIMenu } from '../UIMenu.js';
import { UIFontSize } from '../UIFontSize.js';

export abstract class UIElement {
    public click: boolean;
    public down: boolean;
    public checked: boolean;
    protected _aabb: AABB;
    private _label: string;
    public active: boolean;
    public localAlignH: AlignH;
    public localAlignV: AlignV;
    public alignH: AlignH;
    public alignV: AlignV;
    public cbOnInput?: (uiElement: this) => any;
    protected sprite?: Sprite;
    private _background?: Sprite;
    private _fontSize: UIFontSize;
    protected menu: UIMenu;
    protected input: Input;
    private lastPaddingScalar: number;
    public readonly type: UIElementType;
    public abstract get currentFrame(): UIFrame;
    protected abstract draw(context: OffscreenCanvasRenderingContext2D, canvas: OffscreenCanvas): void;
    public constructor(menu: UIMenu, input: Input, type: UIElementType) {
        this.click = false;
        this.down = false;
        this._aabb = new AABB(new Vector2(1, 1), new Vector2());
        this._label = '';
        this.active = true;
        this.checked = false;
        this.localAlignH = AlignH.Center;
        this.localAlignV = AlignV.Center;
        this.alignH = AlignH.Left;
        this.alignV = AlignV.Top;
        this.menu = menu;
        this.input = input;
        this.type = type;
        this._fontSize = UIFontSize.Medium;
        this.lastPaddingScalar = -1;
    }
    public update(gameTime: GameTime): void {
        if (!this.active) return;

        const trigger = this.input.getButton(InputType.Trigger);
        const pointerPosition = new Vector2(this.input.getAxis(InputType.PointerPositionHorizontal).value, this.input.getAxis(InputType.PointerPositionVertical).value);

        if (trigger.down && !trigger.clicked && this.aabb.intersectsPoint(pointerPosition)) {
            this.click = this.down = true;
        } else if (trigger.down && trigger.clicked && this.aabb.intersectsPoint(pointerPosition)) {
            this.down = true;
            this.click = false;
        } else if (this.down || this.click) {
            this.click = this.down = false;
        }

        if (!this.sprite) this.sprite = new Sprite(this.draw.bind(this));
    }
    public fitText(paddingScalar: number): void {
        this.lastPaddingScalar = paddingScalar;
        if (this.label.length === 0) return;

        const m = this.menu.font.measureText(this.label, this.menu.font.getFont('MainFont', this.fontSize));
        this.aabb = new AABB(new Vector2(~~Math.max(m.x * paddingScalar, 1), ~~Math.max(m.y * paddingScalar, 1)), this._aabb.position);
        this.sprite = new Sprite(this.draw.bind(this));
    }
    public get aabb(): AABB {
        const localAlign = new Vector2(this.localAlignH === AlignH.Left ? 0 : this.localAlignH === AlignH.Center ? - this._aabb.size.x / 2 : - this._aabb.size.x, this.localAlignV === AlignV.Top ? 0 : this.localAlignV === AlignV.Center ? - this._aabb.size.y / 2 : - this._aabb.size.y);
        const globalAlign = new Vector2(this.alignH === AlignH.Left ? 0 : this.alignH === AlignH.Center ? this.menu.aabb.size.x / 2 : this.menu.aabb.size.x, this.alignV === AlignV.Top ? 0 : this.alignV === AlignV.Center ? this.menu.aabb.size.y / 2 : this.menu.aabb.size.y);

        return new AABB(this._aabb.size, this._aabb.position.clone.add(globalAlign).add(localAlign).round());
    }
    public set aabb(val: AABB) {
        this._aabb = val;
    }
    public get label(): string {
        return this._label;
    }
    public set label(val: string) {
        this._label = val;
        if (this.lastPaddingScalar !== -1) this.fitText(this.lastPaddingScalar);
        else this.sprite = new Sprite(this.draw.bind(this));
    }
    public get background(): Sprite | undefined {
        return this._background;
    }
    public set background(val: Sprite | undefined) {
        this._background = val;
        if (this.lastPaddingScalar !== -1) this.fitText(this.lastPaddingScalar);
        else this.sprite = new Sprite(this.draw.bind(this));
    }
    public get fontSize(): UIFontSize {
        return this._fontSize;
    }
    public set fontSize(val: UIFontSize) {
        this._fontSize = val;
        if (this.lastPaddingScalar !== -1) this.fitText(this.lastPaddingScalar);
        else this.sprite = new Sprite(this.draw.bind(this));
    }
}
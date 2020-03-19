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
    public label: string;
    public active: boolean;
    public localAlignH: AlignH;
    public localAlignV: AlignV;
    public alignH: AlignH;
    public alignV: AlignV;
    public cbOnInput?: (uiElement: this) => any;
    protected sprite?: Sprite;
    public background?: Sprite;
    public fontSize: UIFontSize;
    protected menu: UIMenu;
    protected input: Input
    public readonly type: UIElementType;
    public abstract get currentFrame(): UIFrame;
    //protected abstract draw(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void;
    public constructor(menu: UIMenu, input: Input, type: UIElementType) {
        this.click = false;
        this.down = false;
        this._aabb = new AABB(new Vector2(), new Vector2());
        this.label = '';
        this.active = true;
        this.checked = false;
        this.localAlignH = AlignH.Center;
        this.localAlignV = AlignV.Center;
        this.alignH = AlignH.Left;
        this.alignV = AlignV.Top;
        this.menu = menu;
        this.input = input;
        this.type = type;
        this.fontSize = UIFontSize.Medium;
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
    }
    public get aabb(): AABB {
        const localAlign = new Vector2(this.localAlignH === AlignH.Left ? 0 : this.localAlignH === AlignH.Center ? - this._aabb.size.x / 2 : - this._aabb.size.x, this.localAlignV === AlignV.Top ? 0 : this.localAlignV === AlignV.Center ? - this._aabb.size.y / 2 : - this._aabb.size.y);
        const globalAlign = new Vector2(this.alignH === AlignH.Left ? 0 : this.alignH === AlignH.Center ? this.menu.aabb.size.x / 2 : this.menu.aabb.size.x, this.alignV === AlignV.Top ? 0 : this.alignV === AlignV.Center ? this.menu.aabb.size.y / 2 : this.menu.aabb.size.y);

        return new AABB(this._aabb.size, this._aabb.position.clone.add(globalAlign).add(localAlign));
    }
    public set aabb(val: AABB) {
        this._aabb = val;
    }
}
import { Asset } from '../../Assets/Asset.js';
import { GameTime } from '../../GameTime.js';
import { Input } from '../../Input/Input.js';
import { AABB } from '../../Physics/AABB.js';
import { Vector2 } from '../../Vector2.js';
import { UIElementType } from '../UIElementType.js';
import { UIFont } from '../UIFont.js';
import { UIMenu } from '../UIMenu.js';
import { UIElement } from './UIElement.js';

export class UICheckbox extends UIElement {
    private _checked: boolean;
    public constructor(menu: UIMenu, input: Input, font: Asset) {
        super(menu, input, UIElementType.Checkbox, font);

        this._checked = false;
    }

    /**
     * 
     * Checkbox checked?
     * 
     */
    public get checked(): boolean {
        return this._checked;
    }
    public set checked(val: boolean) {
        this._checked = val;
        this.draw();
    }

    /**
     * 
     * Update checked property.
     * 
     */
    public update(gameTime: GameTime): void {
        super.update(gameTime);

        if (this.click) {
            this.checked = !this._checked;

            if (this.onInput) {
                this.onInput(this);
                this.draw();
            }
        }
    }
    protected drawCb(context: OffscreenCanvasRenderingContext2D, canvas: OffscreenCanvas): void {
        const labelSize = UIFont.measureText(this.label, UIFont.getCSSFontString(<string>this.font.data, this.fontSize));

        canvas.height = Math.min(this._aabb.size.x / 100 * (this.menu.aabb.size.x / 100 * this.menu.scene.domElement.width), this._aabb.size.y / 100 * (this.menu.aabb.size.y / 100 * this.menu.scene.domElement.height));
        canvas.width = canvas.height * 1.2 + labelSize.x / 100 * (this.menu.aabb.size.x / 100 * this.menu.scene.domElement.width);

        const x = canvas.width / (this.menu.aabb.size.x / 100 * this.menu.scene.domElement.width) * 100;
        const y = canvas.height / (this.menu.aabb.size.y / 100 * this.menu.scene.domElement.height) * 100;

        (<any>this)._aabb = new AABB(new Vector2(x, y), this._aabb.position);

        context.save();

        if (this.background) context.drawImage(this.background, 0, 0, canvas.height, canvas.width);

        context.strokeStyle = context.fillStyle = context.shadowColor = this.color;

        context.lineWidth = Math.round(this.menu.aabb.size.magnitude / 50);
        if (this.stroke) context.strokeRect(context.lineWidth / 2, context.lineWidth / 2, canvas.height - context.lineWidth, canvas.height - context.lineWidth);

        // checkmark
        if (this._checked) {
            context.beginPath();
            context.moveTo(0.12 * canvas.height, 0.50 * canvas.height);
            context.lineTo(0.38 * canvas.height, 0.75 * canvas.height);
            context.lineTo(0.88 * canvas.height, 0.25 * canvas.height);
            context.stroke();
        }


        context.textAlign = 'right';
        context.textBaseline = 'middle';

        context.font = UIFont.getCSSFontString(<string>this.font.data, this.fontSize);

        if (this.textShadow > 0) {
            context.shadowBlur = context.lineWidth * 1.5 * this.textShadow;
            context.shadowOffsetX = context.lineWidth * this.textShadow;
            context.shadowOffsetY = -context.lineWidth * this.textShadow;
        }

        context.fillText(this.label, canvas.width, canvas.height / 2);

        context.restore();
    }
}
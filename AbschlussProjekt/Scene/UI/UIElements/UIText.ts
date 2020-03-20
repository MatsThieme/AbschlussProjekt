import { Input } from '../../Input/Input.js';
import { Sprite } from '../../Sprite.js';
import { UIElementType } from '../UIElementType.js';
import { UIFrame } from '../UIFrame.js';
import { UIMenu } from '../UIMenu.js';
import { UIElement } from './UIElement.js';

export class UIText extends UIElement {
    public constructor(menu: UIMenu, input: Input) {
        super(menu, input, UIElementType.Text);
    }
    protected draw(context: OffscreenCanvasRenderingContext2D, canvas: OffscreenCanvas): void {
        canvas.width = this.aabb.size.x;
        canvas.height = this.aabb.size.y;
        context.save();

        if (this.background) context.drawImage(this.background.canvasImageSource, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.lineWidth = ~~(this.menu.aabb.size.magnitude / 650);
        if (this.stroke) context.strokeRect(context.lineWidth / 2, context.lineWidth / 2, canvas.width - context.lineWidth, canvas.height - context.lineWidth);

        context.textAlign = 'center';
        context.textBaseline = 'middle';

        //context.font = this.menu.font.fit(this.label, this.menu.font.getFont('MainFont', this.fontSize, false), this.aabb.size.clone.scale(0.9));
        context.font = this.menu.font.getFont('MainFont', this.fontSize);

        context.fillText(this.label, canvas.width / 2, canvas.height / 2);

        context.restore();
    }
    public get currentFrame(): UIFrame {
        return new UIFrame(this.aabb, this.sprite || new Sprite(() => { }));
    }
}
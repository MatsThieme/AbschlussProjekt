import { GameTime } from '../../GameTime.js';
import { Input } from '../../Input/Input.js';
import { Sprite } from '../../Sprite.js';
import { UIElementType } from '../UIElementType.js';
import { UIFrame } from '../UIFrame.js';
import { UIMenu } from '../UIMenu.js';
import { UIElement } from './UIElement.js';

export class UIButton extends UIElement {
    public constructor(menu: UIMenu, input: Input) {
        super(menu, input, UIElementType.Button);
    }
    public update(gameTime: GameTime): void {
        super.update(gameTime);

        if (this.click) {
            if (this.cbOnInput) this.cbOnInput(this);
            this.sprite = new Sprite(this.draw.bind(this));
        }

        if (!this.sprite) this.sprite = new Sprite(this.draw.bind(this));
    }
    private draw(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        context.save();

        debugger;

        if (this.background) context.drawImage(this.background.image, 0, 0, this.aabb.size.x, this.aabb.size.y);

        context.strokeStyle = '#333';
        context.lineWidth = this.aabb.size.magnitude / 100;
        context.strokeRect(0, 0, this.aabb.size.x, this.aabb.size.y);

        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.font = this.menu.font.fit(this.label, this.menu.font.getFont('MainFont', this.fontSize), this.aabb.size.clone.scale(0.8));
        context.fillText(this.label, canvas.width / 2, canvas.height / 2);


        context.restore();
    }
    public get currentFrame(): UIFrame {
        return new UIFrame(this.aabb, this.sprite || new Sprite(() => { }));
    }
}
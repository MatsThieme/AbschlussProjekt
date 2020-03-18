import { UIMenu } from './UIMenu.js';
import { UIFontSize } from './UIFontSize.js';
import { Vector2 } from '../Vector2.js';

export class UIFont {
    private menu: UIMenu;
    public constructor(menu: UIMenu) {
        this.menu = menu;
    }
    private get fontMultiplier() {
        return this.menu.aabb.size.magnitude / 250;
    }
    public getFont(name: string, size: UIFontSize = UIFontSize.Medium, bold: boolean = false) {
        return `${(bold ? 'bold ' : '') + this.fontMultiplier * size}px ${name}`;
    }
    public parseFontString(font: string): { bold: boolean, px: number, name: string } {
        return { bold: font.indexOf('bold') !== -1, px: parseInt((<any>font.match(/.*(\d*)px.*/))[1]), name: (<any>font.match(/.*px (\w*).*/))[1] };
    }
    public measureText(text: string, font: string): Vector2 {
        const { px, bold, name } = this.parseFontString(font);
        const el = document.createElement('div');
        el.style.fontFamily = name;
        el.style.fontSize = px + 'px';
        el.style.fontWeight = bold ? 'bold' : 'normal';
        el.textContent = text;
        el.style.display = 'inline-block'; // ggf nur inline
        el.style.visibility = 'hidden';
        document.body.appendChild(el);

        const width = parseFloat(getComputedStyle(el).width);
        const height = parseFloat(getComputedStyle(el).height);

        el.remove();

        return new Vector2(width, height);
    }
    public fit(text: string, font: string, size: Vector2): string {
        const { px, bold, name } = this.parseFontString(font);
        const { x, y } = this.measureText(text, font);

        const mX = size.x / x;
        const mY = size.y / y;

        const multiplier = Math.max(Math.abs(mX - 1), Math.abs(mY - 1)) === Math.abs(mX - 1) ? mX : mY;

        return this.getFont(name, px * multiplier, bold);
    }
}
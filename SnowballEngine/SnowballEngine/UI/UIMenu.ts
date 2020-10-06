import { Asset } from '../Assets/Asset.js';
import { Client } from '../Client.js';
import { AlignH, AlignV } from '../GameObject/Align.js';
import { GameTime } from '../GameTime.js';
import { Input } from '../Input/Input.js';
import { AABB } from '../Physics/AABB.js';
import { Scene } from '../Scene.js';
import { Vector2 } from '../Vector2.js';
import { UI } from './UI.js';
import { UIElement } from './UIElements/UIElement.js';
import { UIFrame } from './UIFrame.js';

export class UIMenu {
    /**
     * 
     * if true the menu is visible and responsive to user interaction.
     * 
     */
    public active: boolean;

    /**
     * 
     * if true and this.active the scene will be paused.
     * 
     */
    public pauseScene: boolean;

    /**
     *
     * Set priority in drawing queue.
     * 
     */
    public drawPriority: number;
    private readonly uiElements: Map<number, UIElement>;
    private _aabb: AABB;
    public readonly input: Input;
    private readonly canvas: OffscreenCanvas;
    private readonly context: OffscreenCanvasRenderingContext2D;
    public background?: Asset;
    private frame!: UIFrame;

    public localAlignH: AlignH;
    public localAlignV: AlignV;
    public alignH: AlignH;
    public alignV: AlignV;

    private redraw: boolean;

    public readonly scene: Scene;
    public readonly ui: UI;
    public constructor(input: Input, scene: Scene) {
        this.active = false;
        this.pauseScene = true;
        this.drawPriority = 0;
        this.uiElements = new Map();
        this._aabb = new AABB(new Vector2(100, 100), new Vector2());
        this.input = input;
        this.scene = scene;
        this.ui = scene.ui;

        this.localAlignH = AlignH.Left;
        this.localAlignV = AlignV.Top;
        this.alignH = AlignH.Left;
        this.alignV = AlignV.Top;

        this.canvas = new OffscreenCanvas(this.scene.domElement.width, this.scene.domElement.height);
        this.context = this.canvas.getContext('2d')!;

        Client.OnResize(() => this.redraw = true);

        this.redraw = true;
    }

    /**
     * 
     * Add a UIElement to this. The newly created UIElement can be adjusted within the callback.
     * 
     */
    public addUIElement<T extends UIElement>(type: new (menu: UIMenu, input: Input, font: Asset) => T, ...cb: ((uiElement: T, scene: Scene) => any)[]): T {
        const e = new type(this, this.input, this.ui.font);
        this.uiElements.set(e.id, e);
        if (cb) cb.forEach(cb => cb(e, this.scene));
        e.draw();
        this.redraw = true;
        return e;
    }

    /**
     * 
     * Removes the UIElement with the given id if present.
     * 
     */
    public removeUIElement(id: number): void {
        this.uiElements.delete(id);
        this.redraw = true;
    }

    /**
     *
     * Returns the current UIFrame.
     * 
     */
    public get currentFrame(): UIFrame {
        return this.frame;
    }

    /**
     * 
     * Adjusts canvas size to AABB and draws UIElements to it.
     * 
     */
    public update(gameTime: GameTime): void {
        for (const uiElement of [...this.uiElements.values()]) {
            uiElement.update(gameTime);
        }

        if (this.redraw) {
            this.canvas.width = ~~(this.aabb.size.x / 100 * this.scene.domElement.width);
            this.canvas.height = ~~(this.aabb.size.y / 100 * this.scene.domElement.height);

            if (this.background) this.context.drawImage((<CanvasImageSource>this.background.data), 0, 0, this.canvas.width, this.canvas.height);
            else this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (const uiElement of [...this.uiElements.values()]) {
                const { sprite, aabb } = uiElement.currentFrame;
                if (this.background?.imagePXSize && this.background!.imagePXSize.sum !== 0) this.context.drawImage(sprite, Math.round(aabb.position.x / 100 * (this.aabb.size.x / 100 * this.scene.domElement.width)), Math.round(aabb.position.y / 100 * (this.aabb.size.y / 100 * this.scene.domElement.height)), Math.round(aabb.size.x / 100 * (this.aabb.size.x / 100 * this.scene.domElement.width)), Math.round(aabb.size.y / 100 * (this.aabb.size.y / 100 * this.scene.domElement.height)));
            }

            this.frame = new UIFrame(new AABB(this._aabb.size.clone.scale(new Vector2(this.scene.domElement.width, this.scene.domElement.height)).scale(0.01), this._aabb.position), this.canvas);

            this.redraw = false;
        }
    }
    public get aabb(): AABB {
        const localAlign = new Vector2(this.localAlignH === AlignH.Left ? 0 : this.localAlignH === AlignH.Center ? - this._aabb.size.x / 2 : - this._aabb.size.x, this.localAlignV === AlignV.Top ? 0 : this.localAlignV === AlignV.Center ? - this._aabb.size.y / 2 : - this._aabb.size.y);
        const globalAlign = new Vector2(this.alignH === AlignH.Left ? 0 : this.alignH === AlignH.Center ? 50 : 100, this.alignV === AlignV.Top ? 0 : this.alignV === AlignV.Center ? 50 : 100);

        return new AABB(this._aabb.size, this._aabb.position.clone.add(globalAlign).add(localAlign));
    }
    public set aabb(val: AABB) {
        this.redraw = true;
        this._aabb = val;
    }
}
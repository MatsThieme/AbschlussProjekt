import { Frame } from '../../Camera/Frame.js';
import { Sprite } from '../../Sprite.js';
import { Tile } from '../../Tile.js';
import { Vector2 } from '../../Vector2.js';
import { Drawable } from '../Drawable.js';
import { GameObject } from '../GameObject.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';

export class TileMap extends Component implements Drawable {
    public size: Vector2;
    public relativePosition: Vector2;
    public tileMap: (Tile | undefined)[][];
    public constructor(gameObject: GameObject, size: Vector2 = new Vector2(1, 1), relativePosition: Vector2 = new Vector2(), tileMap: (Tile | undefined)[][] = []) {
        super(gameObject, ComponentType.TileMap);

        this.size = size;
        this.relativePosition = relativePosition;
        this.tileMap = tileMap;
    }
    public get currentFrame(): Frame[] {
        const frames: Frame[] = [];

        for (let x = 0; x < this.tileMap[0].length; x++) {
            for (let y = 0; y < this.tileMap.length; y++) {
                const tile = this.tileMap[y][x];
                if (tile) {
                    frames.push(new Frame(new Vector2(x, y).add(this.position), new Vector2(1, 1), tile.sprite instanceof Sprite ? tile.sprite : tile.sprite.currentFrame, this.gameObject.transform.rotation, this.gameObject.drawPriority, 1));
                }
            }
        }

        return frames;
    }
    public get scaledSize(): Vector2 {
        return new Vector2(this.size.x * this.gameObject.transform.scale.x, this.size.y * this.gameObject.transform.scale.y);
    }
    public get position() {
        return Vector2.add(this.relativePosition, this.gameObject.transform.position);
    }
}
import { Angle } from '../../Angle.js';
import { Frame } from '../../Camera/Frame.js';
import { AABB } from '../../Physics/AABB.js';
import { PhysicsMaterial } from '../../Physics/PhysicsMaterial.js';
import { Sprite } from '../../Sprite.js';
import { Vector2 } from '../../Vector2.js';
import { GameObject } from '../GameObject.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';

export class TileMap extends Component {
    public tileSize: Vector2;
    public relativePosition: Vector2;
    public currentFrame: Frame[];
    private _tileMap: (1 | 0)[][];
    public material: PhysicsMaterial;
    public constructor(gameObject: GameObject, tileSize: Vector2 = new Vector2(1, 1), relativePosition: Vector2 = new Vector2(), material: PhysicsMaterial = new PhysicsMaterial(), tileMap: string[][] = []) {
        super(gameObject, ComponentType.TileMap);

        this.tileSize = tileSize;
        this.relativePosition = relativePosition;
        this._tileMap = [];
        this.currentFrame = [];
        this.tileMap = tileMap;
        this.material = material;
    }
    public set tileMap(val: string[][]) {
        this._tileMap = [];
        this.currentFrame = [];
        const sprites: Map<string, Sprite> = new Map();

        for (let y = 0; y < val.length; y++) {
            this._tileMap[y] = [];
            for (let x = 0; x < val[0].length; x++) {
                if (val[y][x] === '') {
                    this._tileMap[y][x] = 0;
                    continue;
                }
                this._tileMap[y][x] = 1;

                if (!sprites.has(val[y][x])) sprites.set(val[y][x], new Sprite(val[y][x]));

                this.currentFrame.push(new Frame(new Vector2(this.position.x + x, this.position.y + this.tileSize.y * (val.length - y - 1)), this.tileSize, <Sprite>sprites.get(val[y][x]), new Angle(), this.gameObject.drawPriority, 1));
            }
        }
    }
    public get collisionMap(): (1 | 0)[][] {
        return this._tileMap;
    }
    public get scaledSize(): Vector2 {
        return new Vector2(this._tileMap[0].length, this._tileMap.length).scale(this.tileSize).scale(this.gameObject.transform.relativeScale);
    }
    public get position() {
        return Vector2.add(this.relativePosition, this.gameObject.transform.position);
    }
    public get AABB(): AABB {
        return new AABB(this.scaledSize, this.position);
    }
    public update() { }
}
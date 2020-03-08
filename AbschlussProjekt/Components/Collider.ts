import { AlignH, AlignV } from '../Align.js';
import { Alignable } from '../Alignable.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';
import { GameObject } from '../GameObject.js';
import { Vector2 } from '../Vector2.js';
import { AABB } from '../Physics/AABB.js';
import { PhysicsMaterial } from '../Physics/PhysicsMaterial.js';

export class Collider extends Component implements Alignable {
    private static nextID: number = 0;
    public readonly id: number;
    protected _relativePosition: Vector2;
    public alignH: AlignH;
    public alignV: AlignV;
    protected _size: Vector2;
    protected _radius: number;
    public material: PhysicsMaterial;
    public _autoMass: number;
    public density: number;
    public constructor(gameObject: GameObject, type: ComponentType = ComponentType.Collider, relativePosition: Vector2 = new Vector2(), material: PhysicsMaterial = new PhysicsMaterial(), density: number = 1, alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, type);
        this._relativePosition = relativePosition;
        this.alignH = alignH;
        this.alignV = alignV;
        this._size = new Vector2();
        this._radius = 0;
        this.material = material;
        this._autoMass = 0;
        this.density = density;
        this.id = Collider.nextID++;
    }
    public get position(): Vector2 {
        let align = new Vector2(this.alignH === AlignH.Left ? -this.size.x / 2 : this.alignH === AlignH.Center ? 0 : this.size.x / 2, this.alignV === AlignV.Bottom ? -this.size.y / 2 : this.alignV === AlignV.Center ? 0 : this.size.y / 2);
        return Vector2.add(this.relativePosition, this.gameObject.transform.position, align);
    }
    public set relativePosition(val: Vector2) {
        this._relativePosition = val;
    }
    public get relativePosition(): Vector2 {
        return this._relativePosition;
    }
    public get scaledSize(): Vector2 {
        return new Vector2(this.size.x * this.gameObject.transform.scale.x, this.size.y * this.gameObject.transform.scale.y);
    }
    public get scaledRadius(): number {
        return this.radius * this.gameObject.transform.scale.sum / 2;
    }
    public get AABB(): AABB {
        return new AABB(this.size, Vector2.add(this.relativePosition, this.gameObject.transform.position));
    }
    public set radius(val: number) {
        this._radius = val;
        this.size = new Vector2(val * 2, val * 2);
    }
    public get radius(): number {
        return this._radius;
    }
    public set size(val: Vector2) {
        this._size = val;
        this._radius = val.x / 2;
    }
    public get size(): Vector2 {
        return this._size;
    }
    public get autoMass(): number {
        if (this._autoMass === 0) this._autoMass = this.area * this.density;
        return this._autoMass;
    }
    private get area(): number {
        return 1;
    }
}
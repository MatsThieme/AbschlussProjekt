import { AlignH, AlignV } from '../Align.js';
import { GameObject } from '../GameObject.js';
import { GameTime } from '../GameTime.js';
import { AABB } from '../Physics/AABB.js';
import { PhysicsMaterial } from '../Physics/PhysicsMaterial.js';
import { Vector2 } from '../Vector2.js';
import { Collider } from './Collider.js';
import { ComponentType } from './ComponentType.js';

export class CircleCollider extends Collider {
    protected _aabb: AABB;
    protected _area: number;
    private _radius: number;
    public constructor(gameObject: GameObject, relativePosition: Vector2 = new Vector2(), material: PhysicsMaterial = new PhysicsMaterial(), density: number = 1, radius: number = 1, alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, ComponentType.CircleCollider, relativePosition, material, density, alignH, alignV);
        this._radius = radius;
        this._area = Math.PI * this.radius ** 2;
        this._aabb = new AABB(new Vector2(this.scaledRadius * 2, this.scaledRadius * 2), this.position);
        this.gameObject.rigidbody.updateInertia();
    }
    public get radius(): number {
        return this._radius;
    }
    public set radius(val: number) {
        this._radius = val;
        this._area = Math.PI * this.radius ** 2;
        this._aabb = new AABB(new Vector2(this.scaledRadius * 2, this.scaledRadius * 2), this.position);
        this.gameObject.rigidbody.updateInertia();
    }
    public get scaledRadius(): number {
        return this.radius * this.gameObject.transform.scale.sum / 2;
    }
    public async update(gameTime: GameTime): Promise<void> {
        this._aabb = new AABB(new Vector2(this.scaledRadius * 2, this.scaledRadius * 2), this.position);
    }
}
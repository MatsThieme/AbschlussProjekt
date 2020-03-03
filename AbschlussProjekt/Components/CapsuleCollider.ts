import { AlignH, AlignV } from '../Align.js';
import { GameObject } from '../GameObject.js';
import { Collider } from './Collider.js';
import { PhysicsMaterial } from '../Physics/PhysicsMaterial.js';
import { Vector2 } from '../Vector2.js';
import { BoxCollider } from './BoxCollider.js';
import { CircleCollider } from './CircleCollider.js';
import { ComponentType } from './ComponentType.js';

export class CapsuleCollider extends Collider {
    public boxCollider: BoxCollider;
    public circleColliderTop: CircleCollider;
    public circleColliderBottom: CircleCollider;
    public constructor(gameObject: GameObject, relativePosition: Vector2 = new Vector2(), material: PhysicsMaterial = new PhysicsMaterial(), size: Vector2 = new Vector2(1, 1), alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, ComponentType.CapsuleCollider, relativePosition, material, alignH, alignV);

        this.boxCollider = new BoxCollider(this.gameObject);
        this.circleColliderTop = new CircleCollider(this.gameObject);
        this.circleColliderBottom = new CircleCollider(this.gameObject);

        this.size = size;
    }
    public set relativePosition(val: Vector2) {
        this._relativePosition = val;
        this.updateCollider();
    }
    public set size(size: Vector2) {
        this._size = size;
        this.updateCollider();
    }
    public get size(): Vector2 {
        return <Vector2>this._size;
    }
    public get position(): Vector2 {
        const align = new Vector2(this.alignH === AlignH.Left ? -this.scaledSize.x : this.alignH === AlignH.Center ? -this.scaledSize.x / 2 : 0, this.alignV === AlignV.Bottom ? -this.scaledSize.y : this.alignV === AlignV.Center ? -this.scaledSize.y / 2 : 0);
        return Vector2.add(this.relativePosition, this.gameObject.transform.position, align);
    }
    private updateCollider(): void {
        this.boxCollider = new BoxCollider(this.gameObject, this.size.clone.scale(0.5).add(this.relativePosition), this.material, new Vector2(this.size.x, Math.max(this.size.y - this.size.x, 0.000001)));

        this.circleColliderTop = new CircleCollider(this.gameObject, this.relativePosition.clone.add(new Vector2(this.radius, this.radius)), this.material, this.size.x / 2, this.alignH, this.alignV);
        this.circleColliderBottom = new CircleCollider(this.gameObject, this.relativePosition.clone.add(new Vector2(this.radius, this.size.y - this.radius)), this.material, this.size.x / 2, this.alignH, this.alignV);
    }
}
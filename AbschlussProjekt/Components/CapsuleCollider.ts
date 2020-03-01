import { AlignH, AlignV } from '../Align.js';
import { GameObject } from '../GameObject.js';
import { Collider } from '../Physics/Collider.js';
import { ColliderType } from '../Physics/ColliderType.js';
import { Collision } from '../Physics/Collision.js';
import { PhysicsMaterial } from '../Physics/PhysicsMaterial.js';
import { Vector2 } from '../Vector2.js';
import { BoxCollider } from './BoxCollider.js';
import { CircleCollider } from './CircleCollider.js';
import { ComponentType } from './ComponentType.js';

export class CapsuleCollider extends Collider {
    //public _size: Vector2 | undefined;
    //private boxCollider: BoxCollider | undefined;
    //private circleColliderTop: CircleCollider | undefined;
    //private circleColliderBottom: CircleCollider | undefined;
    //public constructor(gameObject: GameObject, relativePosition: Vector2 = new Vector2(), material: PhysicsMaterial = new PhysicsMaterial(), size: Vector2 = new Vector2(1, 1), alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
    //    super(gameObject, ComponentType.CapsuleCollider, relativePosition, material, ColliderType.Capsule, alignH, alignV);
    //    this.size = size;
    //}
    //public set size(size: Vector2) {
    //    this._size = size;

    //    this.boxCollider = new BoxCollider(this.gameObject, this.relativePosition,this.material, new Vector2(size.x, Math.max(size.y - size.x, 0.000001)));

    //    const TopPos = this.relativePosition;
    //    const BotPos = this.relativePosition;
    //    BotPos.y += this.size.y;

    //    this.circleColliderTop = new CircleCollider(this.gameObject, TopPos, this.material, size.x / 2, this.alignH, this.alignV);
    //    this.circleColliderBottom = new CircleCollider(this.gameObject, BotPos, this.material, size.x / 2, this.alignH, this.alignV);
    //}
    //public get size(): Vector2 {
    //    return <Vector2>this._size;
    //}
}
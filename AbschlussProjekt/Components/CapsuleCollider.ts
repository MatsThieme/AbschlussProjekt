import { AlignH, AlignV } from '../Align.js';
import { GameObject } from '../GameObject.js';
import { Collider } from '../Physics/Collider.js';
import { ColliderType } from '../Physics/ColliderType.js';
import { Vector2 } from '../Vector2.js';
import { ComponentType } from './ComponentType.js';
import { BoxCollider } from './BoxCollider.js';
import { CircleCollider } from './CircleCollider.js';

export class CapsuleCollider extends Collider {
    public _size: Vector2 | undefined;
    private boxCollider: BoxCollider | undefined;
    private circleColliderTop: CircleCollider | undefined;
    private circleColliderBottom: CircleCollider | undefined;
    public constructor(gameObject: GameObject, relativePosition: Vector2 = new Vector2(), size: Vector2 = new Vector2(1, 1), alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, ComponentType.CapsuleCollider, relativePosition, ColliderType.Capsule, alignH, alignV);
        this.size = size;
    }
    public set size(size: Vector2) {
        this._size = size;

        this.boxCollider = new BoxCollider(this.gameObject, this.relativePosition, new Vector2(size.x, Math.max(size.y - size.x, 0.000001)));

        const TopPos = this.relativePosition;
        const BotPos = this.relativePosition;
        BotPos.y += this.size.y;

        this.circleColliderTop = new CircleCollider(this.gameObject, TopPos, size.x / 2, this.alignH, this.alignV);
        this.circleColliderBottom = new CircleCollider(this.gameObject, BotPos, size.x / 2, this.alignH, this.alignV);
    }
    public get size(): Vector2 {
        return <Vector2>this._size;
    }
    public colliding(): boolean {
        return false;
    }
}
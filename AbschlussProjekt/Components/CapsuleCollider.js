import { AlignH, AlignV } from '../Align.js';
import { Collider } from '../Physics/Collider.js';
import { ColliderType } from '../Physics/ColliderType.js';
import { Vector2 } from '../Vector2.js';
import { ComponentType } from './ComponentType.js';
export class CapsuleCollider extends Collider {
    constructor(gameObject, relativePosition = new Vector2(), size = new Vector2(1, 1), alignH = AlignH.Center, alignV = AlignV.Center) {
        super(gameObject, ComponentType.CapsuleCollider, relativePosition, ColliderType.Capsule, alignH, alignV);
        this.size = size;
    }
    colliding() {
        return false;
    }
}

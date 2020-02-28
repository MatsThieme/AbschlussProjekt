import { AlignH, AlignV } from '../Align.js';
import { Collider } from '../Physics/Collider.js';
import { ColliderType } from '../Physics/ColliderType.js';
import { Vector2 } from '../Vector2.js';
import { ComponentType } from './ComponentType.js';
export class CircleCollider extends Collider {
    constructor(gameObject, relativePosition = new Vector2(), radius = 1, alignH = AlignH.Center, alignV = AlignV.Center) {
        super(gameObject, ComponentType.CircleCollider, relativePosition, ColliderType.Circle, alignH, alignV);
        this.radius = radius;
    }
}

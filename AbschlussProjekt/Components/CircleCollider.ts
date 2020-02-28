import { AlignH, AlignV } from '../Align.js';
import { GameObject } from '../GameObject.js';
import { Collider } from '../Physics/Collider.js';
import { ColliderType } from '../Physics/ColliderType.js';
import { Vector2 } from '../Vector2.js';
import { ComponentType } from './ComponentType.js';

export class CircleCollider extends Collider {
    public constructor(gameObject: GameObject, relativePosition: Vector2 = new Vector2(), radius: number = 1, alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, ComponentType.CircleCollider, relativePosition, ColliderType.Circle, alignH, alignV);
        this.radius = radius;
        this.size = new Vector2(radius * 2, radius * 2);
    }
    public get position(): Vector2 {
        let align = new Vector2(this.alignH === AlignH.Left ? -this.radius : this.alignH === AlignH.Center ? 0 : this.radius, this.alignV === AlignV.Bottom ? this.radius : this.alignV === AlignV.Center ? 0 : -this.radius);
        return Vector2.add(this.relativePosition, this.gameObject.transform.position, align);
    }
}
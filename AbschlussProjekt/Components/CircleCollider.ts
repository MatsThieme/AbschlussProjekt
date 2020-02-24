import { AlignH, AlignV } from '../Align.js';
import { GameObject } from '../GameObject.js';
import { Collider } from '../Physics/Collider.js';
import { ColliderType } from '../Physics/ColliderType.js';
import { Vector2 } from '../Vector2.js';
import { ComponentType } from './ComponentType.js';

export class CircleCollider extends Collider {
    public radius: number;
    public constructor(gameObject: GameObject, relativePosition: Vector2 = new Vector2(), radius: number = 1, alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, ComponentType.CircleCollider, relativePosition, ColliderType.Circle, alignH, alignV);
        this.radius = radius;
    }
}
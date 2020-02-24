import { AlignH, AlignV } from '../Align.js';
import { GameObject } from '../GameObject.js';
import { Collider } from '../Physics/Collider.js';
import { ColliderType } from '../Physics/ColliderType.js';
import { Vector2 } from '../Vector2.js';
import { ComponentType } from './ComponentType.js';

export class BoxCollider extends Collider {
    public size: Vector2;
    public constructor(gameObject: GameObject, relativePosition: Vector2 = new Vector2(), size: Vector2 = new Vector2(1, 1), alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, ComponentType.BoxCollider, relativePosition, ColliderType.Box, alignH, alignV);
        this.size = size;
    }
}
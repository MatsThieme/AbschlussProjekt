import { AlignH, AlignV } from '../Align.js';
import { GameObject } from '../GameObject.js';
import { Collider } from './Collider.js';
import { PhysicsMaterial } from '../Physics/PhysicsMaterial.js';
import { Vector2 } from '../Vector2.js';
import { ComponentType } from './ComponentType.js';

export class BoxCollider extends Collider {
    public constructor(gameObject: GameObject, relativePosition: Vector2 = new Vector2(), material: PhysicsMaterial = new PhysicsMaterial(), size: Vector2 = new Vector2(1, 1), alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, ComponentType.BoxCollider, relativePosition, material, alignH, alignV);
        this.size = size;
        this.radius = size.x / 2;
    }
    public get position() {
        const align = new Vector2(this.alignH === AlignH.Left ? -this.scaledSize.x : this.alignH === AlignH.Center ? -this.scaledSize.x / 2 : 0, this.alignV === AlignV.Bottom ? -this.scaledSize.y : this.alignV === AlignV.Center ? -this.scaledSize.y / 2 : 0);
        return Vector2.add(this.relativePosition, this.gameObject.transform.position, align);
    }
}
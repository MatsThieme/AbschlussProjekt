import { AlignH, AlignV } from '../Align.js';
import { GameObject } from '../GameObject.js';
import { Collider } from './Collider.js';
import { PhysicsMaterial } from '../Physics/PhysicsMaterial.js';
import { Vector2 } from '../Vector2.js';
import { ComponentType } from './ComponentType.js';

export class BoxCollider extends Collider {
    public constructor(gameObject: GameObject, relativePosition: Vector2 = new Vector2(), material: PhysicsMaterial = new PhysicsMaterial(), density: number = 1, size: Vector2 = new Vector2(1, 1), alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, ComponentType.BoxCollider, relativePosition, material, density, alignH, alignV);
        this.size = size;
        this.radius = Math.max(size.x, size.y) / 2;
    }
    public get area(): number {
        return 1;
    }
}
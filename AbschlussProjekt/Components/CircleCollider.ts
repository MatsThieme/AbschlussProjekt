import { AlignH, AlignV } from '../Align.js';
import { GameObject } from '../GameObject.js';
import { Collider } from './Collider.js';
import { PhysicsMaterial } from '../Physics/PhysicsMaterial.js';
import { Vector2 } from '../Vector2.js';
import { ComponentType } from './ComponentType.js';

export class CircleCollider extends Collider {
    public constructor(gameObject: GameObject, relativePosition: Vector2 = new Vector2(), material: PhysicsMaterial = new PhysicsMaterial(), radius: number = 1, alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, ComponentType.CircleCollider, relativePosition, material, alignH, alignV);
        this.radius = radius;
        this.size = new Vector2(radius * 2, radius * 2);
    }
    public get position(): Vector2 {
        let align = new Vector2(this.alignH === AlignH.Left ? -this.radius : this.alignH === AlignH.Center ? 0 : this.radius, this.alignV === AlignV.Bottom ? this.radius : this.alignV === AlignV.Center ? 0 : -this.radius);
        return Vector2.add(this.relativePosition, this.gameObject.transform.position, align);
    }
    public recalculateDirection(contactPoint: Vector2, velocity: Vector2): Vector2 {
        const localContactPoint = contactPoint.sub(this.gameObject.transform.position);
        const angle = localContactPoint.angleBetween(new Vector2(), new Vector2(1, 0));
        console.log('angle:', angle.degree);
        const x = velocity.rotateAround(new Vector2(), angle);
        console.log('v:', Math.round(x.x * 1000) / 1000, Math.round(x.y * 1000) / 1000);
        x.x *= -1;

        angle.radian *= -1;
        return x.rotateAround(new Vector2(), angle);
    }
}
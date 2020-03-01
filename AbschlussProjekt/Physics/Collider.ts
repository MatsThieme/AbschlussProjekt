import { AlignH, AlignV } from '../Align.js';
import { Component } from '../Components/Component.js';
import { ComponentType } from '../Components/ComponentType.js';
import { GameObject } from '../GameObject.js';
import { Vector2 } from '../Vector2.js';
import { ColliderType } from './ColliderType.js';
import { Collision } from './Collision.js';
import { PhysicsMaterial } from './PhysicsMaterial.js';

export class Collider extends Component {
    public relativePosition: Vector2;
    public readonly colliderType: ColliderType;
    public alignH: AlignH;
    public alignV: AlignV;
    public size: Vector2;
    public radius: number;
    public material: PhysicsMaterial;
    public constructor(gameObject: GameObject, type: ComponentType = ComponentType.Collider, relativePosition: Vector2 = new Vector2(), material: PhysicsMaterial = new PhysicsMaterial(), colliderType: ColliderType = ColliderType.None, alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, type);
        this.relativePosition = relativePosition;
        this.colliderType = colliderType;
        this.alignH = alignH;
        this.alignV = alignV;
        this.size = new Vector2();
        this.radius = 0;
        this.material = material;
    }
    public get position(): Vector2 {
        return new Vector2();
    }
}
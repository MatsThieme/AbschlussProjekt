import { AlignH, AlignV } from '../Align.js';
import { Component } from '../Components/Component.js';
import { ComponentType } from '../Components/ComponentType.js';
import { GameObject } from '../GameObject.js';
import { Vector2 } from '../Vector2.js';
import { ColliderType } from './ColliderType.js';
import { Transform } from '../Components/Transform.js';

export class Collider extends Component {
    public relativePosition: Vector2;
    public readonly colliderType: ColliderType;
    public alignH: AlignH;
    public alignV: AlignV;
    public size: Vector2;
    public radius: number;
    public constructor(gameObject: GameObject, type: ComponentType = ComponentType.Collider, relativePosition: Vector2, colliderType: ColliderType, alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, type);
        this.relativePosition = relativePosition;
        this.colliderType = colliderType;
        this.alignH = alignH;
        this.alignV = alignV;
    }
    public get position() {
        let align = new Vector2(this.alignH === AlignH.Left ? -this.size.x : this.alignH === AlignH.Center ? -this.size.x / 2 : 0, this.alignV === AlignV.Bottom ? -this.size.y : this.alignV === AlignV.Center ? -this.size.y / 2 : 0);
        return Vector2.add(this.relativePosition, this.gameObject.getComponent(Transform).position, align);
    }
}
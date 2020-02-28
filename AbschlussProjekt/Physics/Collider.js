import { AlignH, AlignV } from '../Align.js';
import { Component } from '../Components/Component.js';
import { ComponentType } from '../Components/ComponentType.js';
import { Vector2 } from '../Vector2.js';
import { Transform } from '../Components/Transform.js';
export class Collider extends Component {
    constructor(gameObject, type = ComponentType.Collider, relativePosition, colliderType, alignH = AlignH.Center, alignV = AlignV.Center) {
        super(gameObject, type);
        this.relativePosition = relativePosition;
        this.colliderType = colliderType;
        this.alignH = alignH;
        this.alignV = alignV;
        this.size = new Vector2();
        this.radius = 0;
    }
    get position() {
        let align = new Vector2(this.alignH === AlignH.Left ? -this.size.x : this.alignH === AlignH.Center ? -this.size.x / 2 : 0, this.alignV === AlignV.Bottom ? -this.size.y : this.alignV === AlignV.Center ? -this.size.y / 2 : 0);
        return Vector2.add(this.relativePosition, this.gameObject.getComponent(Transform).position, align);
    }
}

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { AlignH, AlignV } from '../Align.js';
import { Collider } from '../Physics/Collider.js';
import { ColliderType } from '../Physics/ColliderType.js';
import { Vector2 } from '../Vector2.js';
import { ComponentType } from './ComponentType.js';
var CircleCollider = /** @class */ (function (_super) {
    __extends(CircleCollider, _super);
    function CircleCollider(gameObject, relativePosition, radius, alignH, alignV) {
        if (relativePosition === void 0) { relativePosition = new Vector2(); }
        if (radius === void 0) { radius = 1; }
        if (alignH === void 0) { alignH = AlignH.Center; }
        if (alignV === void 0) { alignV = AlignV.Center; }
        var _this = _super.call(this, gameObject, ComponentType.CircleCollider, relativePosition, ColliderType.Circle, alignH, alignV) || this;
        _this.radius = radius;
        _this.size = new Vector2(radius * 2, radius * 2);
        return _this;
    }
    Object.defineProperty(CircleCollider.prototype, "position", {
        get: function () {
            var align = new Vector2(this.alignH === AlignH.Left ? -this.radius : this.alignH === AlignH.Center ? 0 : this.radius, this.alignV === AlignV.Bottom ? this.radius : this.alignV === AlignV.Center ? 0 : -this.radius);
            return Vector2.add(this.relativePosition, this.gameObject.transform.position, align);
        },
        enumerable: true,
        configurable: true
    });
    return CircleCollider;
}(Collider));
export { CircleCollider };

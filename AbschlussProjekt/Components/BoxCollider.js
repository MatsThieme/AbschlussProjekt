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
var BoxCollider = /** @class */ (function (_super) {
    __extends(BoxCollider, _super);
    function BoxCollider(gameObject, relativePosition, size, alignH, alignV) {
        if (relativePosition === void 0) { relativePosition = new Vector2(); }
        if (size === void 0) { size = new Vector2(1, 1); }
        if (alignH === void 0) { alignH = AlignH.Center; }
        if (alignV === void 0) { alignV = AlignV.Center; }
        var _this = _super.call(this, gameObject, ComponentType.BoxCollider, relativePosition, ColliderType.Box, alignH, alignV) || this;
        _this.size = size;
        _this.radius = size.x / 2;
        return _this;
    }
    Object.defineProperty(BoxCollider.prototype, "position", {
        get: function () {
            var align = new Vector2(this.alignH === AlignH.Left ? -this.size.x : this.alignH === AlignH.Center ? -this.size.x / 2 : 0, this.alignV === AlignV.Bottom ? -this.size.y : this.alignV === AlignV.Center ? -this.size.y / 2 : 0);
            return Vector2.add(this.relativePosition, this.gameObject.transform.position, align);
        },
        enumerable: true,
        configurable: true
    });
    return BoxCollider;
}(Collider));
export { BoxCollider };

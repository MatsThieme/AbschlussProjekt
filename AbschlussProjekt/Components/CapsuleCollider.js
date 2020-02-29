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
import { BoxCollider } from './BoxCollider.js';
import { CircleCollider } from './CircleCollider.js';
var CapsuleCollider = /** @class */ (function (_super) {
    __extends(CapsuleCollider, _super);
    function CapsuleCollider(gameObject, relativePosition, size, alignH, alignV) {
        if (relativePosition === void 0) { relativePosition = new Vector2(); }
        if (size === void 0) { size = new Vector2(1, 1); }
        if (alignH === void 0) { alignH = AlignH.Center; }
        if (alignV === void 0) { alignV = AlignV.Center; }
        var _this = _super.call(this, gameObject, ComponentType.CapsuleCollider, relativePosition, ColliderType.Capsule, alignH, alignV) || this;
        _this.size = size;
        return _this;
    }
    Object.defineProperty(CapsuleCollider.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (size) {
            this._size = size;
            this.boxCollider = new BoxCollider(this.gameObject, this.relativePosition, new Vector2(size.x, Math.max(size.y - size.x, 0.000001)));
            var TopPos = this.relativePosition;
            var BotPos = this.relativePosition;
            BotPos.y += this.size.y;
            this.circleColliderTop = new CircleCollider(this.gameObject, TopPos, size.x / 2, this.alignH, this.alignV);
            this.circleColliderBottom = new CircleCollider(this.gameObject, BotPos, size.x / 2, this.alignH, this.alignV);
        },
        enumerable: true,
        configurable: true
    });
    CapsuleCollider.prototype.colliding = function () {
        return false;
    };
    return CapsuleCollider;
}(Collider));
export { CapsuleCollider };

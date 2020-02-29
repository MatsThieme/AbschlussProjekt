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
import { Component } from '../Components/Component.js';
import { ComponentType } from '../Components/ComponentType.js';
import { Vector2 } from '../Vector2.js';
var Collider = /** @class */ (function (_super) {
    __extends(Collider, _super);
    function Collider(gameObject, type, relativePosition, colliderType, alignH, alignV) {
        if (type === void 0) { type = ComponentType.Collider; }
        if (alignH === void 0) { alignH = AlignH.Center; }
        if (alignV === void 0) { alignV = AlignV.Center; }
        var _this = _super.call(this, gameObject, type) || this;
        _this.relativePosition = relativePosition;
        _this.colliderType = colliderType;
        _this.alignH = alignH;
        _this.alignV = alignV;
        _this.size = new Vector2();
        _this.radius = 0;
        return _this;
    }
    return Collider;
}(Component));
export { Collider };

var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { clamp } from './Helpers.js';
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector2.add = function () {
        var vectors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            vectors[_i] = arguments[_i];
        }
        return vectors.reduce(function (a, b) { a.x += b.x; a.y += b.y; return a; }, new Vector2());
    };
    Vector2.prototype.add = function () {
        var vectors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            vectors[_i] = arguments[_i];
        }
        var v = Vector2.add.apply(Vector2, __spreadArrays(vectors, [this]));
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    Vector2.sub = function (v) {
        var vectors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            vectors[_i - 1] = arguments[_i];
        }
        return vectors.reduce(function (a, b) { a.x -= b.x; a.y -= b.y; return a; }, v);
    };
    Vector2.prototype.sub = function () {
        var vectors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            vectors[_i] = arguments[_i];
        }
        var v = Vector2.sub.apply(Vector2, __spreadArrays([this], vectors));
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    Vector2.divide = function (vector, factor) {
        return new Vector2(vector.x / factor, vector.y / factor);
    };
    Vector2.average = function () {
        var vectors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            vectors[_i] = arguments[_i];
        }
        return Vector2.divide(Vector2.add.apply(Vector2, vectors), vectors.length);
    };
    Vector2.prototype.clamp = function (xMin, xMax, yMin, yMax) {
        this.x = clamp(xMin, xMax, this.x);
        this.y = clamp(yMin, yMax, this.y);
        return this;
    };
    Vector2.prototype.rotateAround = function (around, radian) {
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        this.x -= around.x;
        this.y -= around.y;
        this.x = this.x * c - this.y * s + around.x;
        this.y = this.x * s + this.y * c + around.y;
        return this;
    };
    Vector2.prototype.radianBetween = function (around, other) {
        var r1 = this.clone.sub(around);
        var r2 = other.clone.sub(around);
        return Math.atan2(r2.y - r1.y, r2.x - r1.x);
    };
    Object.defineProperty(Vector2.prototype, "clone", {
        get: function () {
            return new Vector2(this.x, this.y);
        },
        enumerable: true,
        configurable: true
    });
    return Vector2;
}());
export { Vector2 };

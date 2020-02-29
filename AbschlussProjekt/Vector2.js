var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Angle } from './Angle.js';
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
        return vectors.reduce(function (a, b) { a.x -= b.x; a.y -= b.y; return a; }, v.clone);
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
    Vector2.multiply = function (v) {
        var vectors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            vectors[_i - 1] = arguments[_i];
        }
        return vectors.reduce(function (a, b) { a.x *= b.x; a.y *= b.y; return a; }, v.clone).sum;
    };
    Vector2.average = function () {
        var vectors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            vectors[_i] = arguments[_i];
        }
        return Vector2.divide(Vector2.add.apply(Vector2, vectors), vectors.length);
    };
    Vector2.prototype.rotateAround = function (rotatePoint, angle) {
        var s = Math.sin(angle.radian);
        var c = Math.cos(angle.radian);
        this.x -= rotatePoint.x;
        this.y -= rotatePoint.y;
        this.x = this.x * c - this.y * s + rotatePoint.x;
        this.y = this.x * s + this.y * c + rotatePoint.y;
        return this;
    };
    Vector2.prototype.angleBetween = function (rotatePoint, other) {
        var r1 = this.clone.sub(rotatePoint);
        var r2 = other.clone.sub(rotatePoint);
        return new Angle(Math.acos(Vector2.multiply(r1, r2) / (r1.magnitude * r2.magnitude)));
    };
    Object.defineProperty(Vector2.prototype, "clone", {
        get: function () {
            return new Vector2(this.x, this.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "sum", {
        get: function () {
            return this.x + this.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "magnitude", {
        get: function () {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        },
        enumerable: true,
        configurable: true
    });
    return Vector2;
}());
export { Vector2 };

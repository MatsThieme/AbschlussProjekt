var Angle = /** @class */ (function () {
    function Angle(radian, degree) {
        this._radian = 0;
        this._degree = 0;
        if (radian)
            this.radian = radian;
        if (degree)
            this.degree = degree;
    }
    Object.defineProperty(Angle.prototype, "radian", {
        get: function () {
            return this._radian;
        },
        set: function (val) {
            this._radian = this.normalizeRadian(val);
            this._degree = this.radian * 180 / Math.PI;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Angle.prototype, "degree", {
        get: function () {
            return this._degree;
        },
        set: function (val) {
            this._degree = this.normalizeDegree(val);
            this._radian = this.degree * Math.PI / 180;
        },
        enumerable: true,
        configurable: true
    });
    Angle.prototype.normalizeRadian = function (radian) {
        radian %= Math.PI * 2;
        if (radian < 0)
            radian += Math.PI * 2;
        return radian;
    };
    Angle.prototype.normalizeDegree = function (deg) {
        deg %= 360;
        if (deg < 0)
            deg += 360;
        return deg;
    };
    return Angle;
}());
export { Angle };

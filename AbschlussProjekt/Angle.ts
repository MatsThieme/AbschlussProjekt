export class Angle {
    private _radian: number;
    private _degree: number;
    public constructor(radian?: number, degree?: number) {
        this._radian = 0;
        this._degree = 0;
        if (radian) this.radian = radian;
        if (degree) this.degree = degree;
    }
    public get radian(): number {
        return this._radian;
    }
    public set radian(val: number) {
        this._radian = this.normalizeRadian(val);
        this._degree = this.radian * 180 / Math.PI;
    }
    public get degree(): number {
        return this._degree;
    }
    public set degree(val: number) {
        this._degree = this.normalizeDegree(val);
        this._radian = this.degree * Math.PI / 180;
    }
    private normalizeRadian(radian: number): number {
        radian %= Math.PI * 2;
        if (radian < 0) radian += Math.PI * 2;
        return radian;
    }
    private normalizeDegree(deg: number): number {
        deg %= 360;
        if (deg < 0) deg += 360;
        return deg;
    }
}
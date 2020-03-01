import { Angle } from './Angle.js';

export class Vector2 {
    public x: number;
    public y: number;
    private _magnitude: number = 0;
    public constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
    public static add(...vectors: Vector2[]) {
        return vectors.reduce((a: Vector2, b: Vector2) => { a.x += b.x; a.y += b.y; return a; }, new Vector2());
    }
    public add(...vectors: Vector2[]): Vector2 {
        const v = Vector2.add(...vectors, this);
        this.x = v.x;
        this.y = v.y;
        this.recalculateMagnitude();

        return this;
    }
    public static sub(v: Vector2, ...vectors: Vector2[]) {
        return vectors.reduce((a: Vector2, b: Vector2) => { a.x -= b.x; a.y -= b.y; return a; }, v.clone);
    }
    public sub(...vectors: Vector2[]): Vector2 {
        const v = Vector2.sub(this, ...vectors);
        this.x = v.x;
        this.y = v.y;
        this.recalculateMagnitude();

        return this;
    }
    public static divide(vector: Vector2, factor: number): Vector2 {
        return new Vector2(vector.x / factor, vector.y / factor);
    }
    public static multiply(v: Vector2, ...vectors: Vector2[]): number {
        return vectors.reduce((a: Vector2, b: Vector2) => { a.x *= b.x; a.y *= b.y; return a; }, v.clone).sum;
    }
    public static average(...vectors: Vector2[]) {
        return Vector2.divide(Vector2.add(...vectors), vectors.length);
    }
    public rotateAround(rotatePoint: Vector2, angle: Angle): Vector2 {
        const s = Math.sin(angle.radian);
        const c = Math.cos(angle.radian);

        this.x -= rotatePoint.x;
        this.y -= rotatePoint.y;

        this.x = this.x * c - this.y * s + rotatePoint.x;
        this.y = this.x * s + this.y * c + rotatePoint.y;

        return this;
    }
    public angleBetween(rotatePoint: Vector2, other: Vector2): Angle {
        const r1 = this.clone.sub(rotatePoint);
        const r2 = other.clone.sub(rotatePoint);

        return new Angle(Math.acos(Vector2.multiply(r1, r2) / (r1.magnitude * r2.magnitude)));
    }
    public get clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }
    public get sum() {
        return this.x + this.y;
    }
    public get magnitudeSquared() {
        return this.x ** 2 + this.y ** 2;
    }
    public get magnitude() {
        if (this._magnitude === 0) this._magnitude = Math.sqrt(this.magnitudeSquared);
        return this._magnitude;
    }
    public scale(scalar: number): Vector2 {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    public get normalized(): Vector2 {
        return this.clone.normalize();
    }
    public normalize(): Vector2 {
        this.x /= this.magnitude;
        this.y /= this.magnitude;
        this.recalculateMagnitude();

        return this;
    }
    public recalculateMagnitude(): void {
        this._magnitude = Math.sqrt(this.magnitudeSquared);
    }
    public toString(): string {
        return `x: ${Math.round(this.x * 10000) / 10000}, y: ${Math.round(this.y * 10000) / 10000}`;
    }
}
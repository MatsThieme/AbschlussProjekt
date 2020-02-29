import { clamp } from './Helpers.js';
import { Angle } from './Angle.js';

export class Vector2 {
    public x: number;
    public y: number;
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

        return this;
    }
    public static sub(v: Vector2, ...vectors: Vector2[]) {
        return vectors.reduce((a: Vector2, b: Vector2) => { a.x -= b.x; a.y -= b.y; return a; }, v);
    }
    public sub(...vectors: Vector2[]): Vector2 {
        const v = Vector2.sub(this, ...vectors);
        this.x = v.x;
        this.y = v.y;

        return this;
    }
    public static divide(vector: Vector2, factor: number) {
        return new Vector2(vector.x / factor, vector.y / factor);
    }
    public static average(...vectors: Vector2[]) {
        return Vector2.divide(Vector2.add(...vectors), vectors.length);
    }
    public clamp(xMin: number, xMax: number, yMin: number, yMax: number): Vector2 {
        this.x = clamp(xMin, xMax, this.x);
        this.y = clamp(yMin, yMax, this.y);

        return this;
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

        return new Angle(Math.atan2(r2.y - r1.y, r2.x - r1.x));
    }
    public get clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }
}
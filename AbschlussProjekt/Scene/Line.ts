import { Vector2 } from './Vector2.js';

export class Line {
    public a: Vector2;
    public b: Vector2;
    public s: Vector2;
    public constructor(a: Vector2, b: Vector2) {
        this.a = a;
        this.b = b;
        this.s = b.clone.sub(a);
    }
    public get center(): Vector2 {
        return Vector2.average(this.a, this.b);
    }
    public intersects(other: Line): Vector2 | undefined {
        const p = this.a;
        const r = this.s;
        const q = other.a;
        const s = other.s;

        const abc = Vector2.cross(q.clone.sub(p), r);
        const def = Vector2.cross(q.clone.sub(p), s);
        const ghi = Vector2.cross(r, s);

        const u = abc / ghi;

        const t = def / ghi;

        if (abc != 0 && t >= 0 && t <= 1 && u >= 0 && u <= 1) return q.clone.add(s.clone.scale(u));
        else return;
    }
    public distanceToPoint(point: Vector2): number {
        const w = this.a;
        const v = this.b;

        const l2 = w.clone.sub(v).magnitudeSquared;
        if (l2 == 0) return point.distance(v)

        const t = Math.max(0, Math.min(1, Vector2.dot(point.clone.sub(v), w.clone.sub(v)) / l2));
        const projection = w.clone.sub(v).scale(t).add(v);
        return point.distance(projection);
    }
}
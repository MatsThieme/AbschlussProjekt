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
    public static divide(vector: Vector2, factor: number) {
        return new Vector2(vector.x / factor, vector.y / factor);
    }
    public static average(...vectors: Vector2[]) {
        return Vector2.divide(Vector2.add(...vectors), vectors.length);
    }
}
export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    static add(...vectors) {
        return vectors.reduce((a, b) => { a.x += b.x; a.y += b.y; return a; }, new Vector2());
    }
    static divide(vector, factor) {
        return new Vector2(vector.x / factor, vector.y / factor);
    }
    static average(...vectors) {
        return Vector2.divide(Vector2.add(...vectors), vectors.length);
    }
}

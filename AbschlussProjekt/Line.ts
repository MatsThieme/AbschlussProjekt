import { Vector2 } from "./Vector2";

export class Line {
    public a: Vector2;
    public b: Vector2;
    public constructor(a: Vector2, b: Vector2) {
        this.a = a;
        this.b = b;
    }
}
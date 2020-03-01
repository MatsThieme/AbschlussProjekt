import { Vector2 } from '../Vector2.js';
import { Collider } from './Collider.js';

export class AABB {
    public size: Vector2;
    public position: Vector2;
    public constructor(size: Vector2, position: Vector2) {
        this.size = size;
        this.position = position;
    }
    public intersects(other: AABB): boolean {
        return this.position.x < other.position.x + other.size.x && this.position.x + this.size.x > other.position.x && this.position.y < other.position.y + other.size.y && this.position.y + this.size.y > other.position.y;
}
    public static intersects(collider1: Collider, collider2: Collider): boolean {
        return collider1.AABB.intersects(collider2.AABB);
    }
}
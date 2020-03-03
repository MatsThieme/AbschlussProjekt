import { Collider } from '../Components/Collider.js';
import { GameObject } from '../GameObject.js';
import { Vector2 } from '../Vector2.js';

export class Collision {
    public readonly colliderA: Collider;
    public readonly colliderB: Collider;
    public readonly resolveDirection: Vector2 | undefined;
    public readonly penetrationDepth: number;
    public readonly contactPoints: Vector2[];
    public constructor(colliderA: Collider, colliderB: Collider, resolveDirection?: Vector2, penetrationDepth: number = 0, contactPoints: Vector2[] = []) {
        this.colliderA = colliderA;
        this.colliderB = colliderB;
        this.resolveDirection = resolveDirection;
        this.penetrationDepth = penetrationDepth;
        this.contactPoints = contactPoints;
    }
}
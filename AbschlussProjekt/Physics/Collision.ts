import { Collider } from '../Components/Collider.js';
import { GameObject } from '../GameObject.js';
import { Vector2 } from '../Vector2.js';

export class Collision {
    public readonly colliderA: Collider;
    public readonly colliderB: Collider;
    public readonly resolveDirection: Vector2 | undefined;
    public readonly penetrationDepth: number;
    public readonly contactPoints: Vector2[];
    public readonly solved: Solved | undefined;
    public constructor(colliderA: Collider, colliderB: Collider, resolveDirection?: Vector2, penetrationDepth: number = 0, contactPoints: Vector2[] = []) {
        this.colliderA = colliderA;
        this.colliderB = colliderB;
        this.resolveDirection = resolveDirection;
        this.penetrationDepth = penetrationDepth;
        this.contactPoints = contactPoints;
        this.solved = Collision.solve(this);
    }
    public static solve(collision: Collision): Solved | undefined {
        if (!collision.resolveDirection) return;
        const rb1 = collision.colliderA.gameObject.rigidbody;
        const rb2 = collision.colliderB.gameObject.rigidbody;

        if (rb1.mass === 0 && rb2.mass === 0) return;

        const rv = rb1.velocity.sub(rb2.velocity);

        const velAlongNormal = Vector2.multiply(rv, collision.resolveDirection);

        if (velAlongNormal > 0) return;

        const e = Math.min(rb1.material.bounciness, rb2.material.bounciness);

        let j = -(1 + e) * velAlongNormal;
        j /= rb1.invMass + rb2.invMass;

        let impulse = collision.resolveDirection.scale(j);

        return {
            collision,
            A: { velocity: impulse.scale(-rb1.invMass), angularVelocity: new Vector2() },
            B: { velocity: impulse.scale(rb2.invMass), angularVelocity: new Vector2() }
        };
    }
}

declare interface Solved {
    readonly collision: Collision;
    readonly A: { velocity: Vector2, angularVelocity: Vector2 };
    readonly B: { velocity: Vector2, angularVelocity: Vector2 };
}
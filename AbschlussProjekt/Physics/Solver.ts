import { Vector2 } from '../Vector2.js';
import { Collision } from './Collision.js';


// angular velocity berechnen

export class Solver {
    public static solve(collision: Collision): Solved | undefined {
        if (!collision.normal) return;
        const rb1 = collision.gameObjectA.rigidbody;
        const rb2 = collision.gameObjectB.rigidbody;

        if (rb1.mass === 0 && rb2.mass === 0) return;

        const rv = rb1.velocity.sub(rb2.velocity);

        const velAlongNormal = Vector2.multiply(rv, collision.normal);

        if (velAlongNormal > 0) return;

        const e = Math.min(rb1.material.bounciness, rb2.material.bounciness);

        let j = -(1 + e) * velAlongNormal;
        j /= rb1.invMass + rb2.invMass;

        let impulse = collision.normal.scale(j);

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
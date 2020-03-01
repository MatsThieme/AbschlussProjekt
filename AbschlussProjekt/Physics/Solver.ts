import { RigidBody } from '../Components/RigidBody.js';
import { Vector2 } from '../Vector2.js';
import { Collision } from './Collision.js';

export class Solver {
    public static solve(collision: Collision): void {
        if (!collision.normal) return;
        const rb1 = collision.gameObjectA.getComponent(RigidBody);
        const rb2 = collision.gameObjectB.getComponent(RigidBody);

        if (rb1.mass === 0 && rb2.mass === 0) return;

        const rv = rb1.velocity.sub(rb2.velocity);

        const velAlongNormal = Vector2.multiply(rv, collision.normal);

        if (velAlongNormal > 0) return;

        const e = Math.min(rb1.material.bounciness, rb2.material.bounciness);

        let j = -(1 + e) * velAlongNormal;
        j /= rb1.invMass + rb2.invMass;

        let impulse = collision.normal.scale(j);

        // this is
        rb1.impulse(impulse.scale(-rb1.invMass));
        rb2.impulse(impulse.scale(rb2.invMass));

        // same as this
        //rb1.velocity.sub(impulse.scale(rb1.invMass));
        //rb2.velocity.add(impulse.scale(rb2.invMass));
    }
}
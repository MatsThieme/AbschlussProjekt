import { RigidBody } from '../Components/RigidBody.js';
import { GameObject } from '../GameObject.js';
import { Vector2 } from '../Vector2.js';


const normal: Vector2 = new Vector2();

export class Solver {
    public constructor() {

    }
    public solve(gameObject1: GameObject, gameObject2: GameObject): void {
        const rb1 = gameObject1.getComponent(RigidBody);
        const rb2 = gameObject2.getComponent(RigidBody);

        if (rb1.mass === 0 && rb2.mass === 0) return;

        const rv = rb1.velocity.sub(rb2.velocity);

        const velAlongNormal = Vector2.multiply(rv, normal);

        if (velAlongNormal > 0) return;

        const e = Math.min(rb1.material.bounciness, rb2.material.bounciness);

        let j = -(1 + e) * velAlongNormal;
        j /= rb1.invMass + rb2.invMass;

        let impulse = normal.scale(j);
        rb1.velocity.sub(impulse.scale(rb1.invMass));
        rb2.velocity.add(impulse.scale(rb2.invMass));
    }
}
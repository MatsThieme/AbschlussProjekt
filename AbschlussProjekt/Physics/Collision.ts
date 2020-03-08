import { Collider } from '../Components/Collider.js';
import { Vector2 } from '../Vector2.js';

export class Collision {
    public readonly colliderA: Collider;
    public readonly colliderB: Collider;
    public readonly normal: Vector2 | undefined;
    public readonly penetrationDepth: number | undefined;
    public readonly contactPoints: Vector2[] | undefined;
    public readonly solved: Solved | undefined;
    public constructor(colliderA: Collider, colliderB: Collider, normal?: Vector2, penetrationDepth?: number, contactPoints?: Vector2[]) {
        this.colliderA = colliderA;
        this.colliderB = colliderB;
        this.normal = normal;
        this.penetrationDepth = penetrationDepth;
        this.contactPoints = contactPoints;
        this.solved = Collision.solve(this);
    }
    public static solve(collision: Collision): Solved | undefined {
        if (!collision.normal) return;
        const rb1 = collision.colliderA.gameObject.rigidbody;
        const rb2 = collision.colliderB.gameObject.rigidbody;

        if (rb1.mass === 0 && rb2.mass === 0) return;

        //const rv = rb1.velocity.sub(rb2.velocity);

        //const velAlongNormal = Vector2.dot(rv, collision.normal);

        //if (velAlongNormal > 0) return;

        //const e = Math.min(rb1.material.bounciness, rb2.material.bounciness);

        //let j = -(1 + e) * velAlongNormal / (rb1.invMass + 1 / rb2.invMass);

        //let impulse = collision.normal.clone.scale(j);

        return {
            collision,
            A: collision.normal.clone.normalize().scale(<number>collision.penetrationDepth),
            B: collision.normal.clone.normalize().scale(-<number>collision.penetrationDepth)
        };
    //    return {
    //        collision,
    //        A: impulse.clone.scale(-1),
    //        B: impulse.clone
    //    };
    }
    public static reduce(...collisions: Collision[]): Collision | undefined {
        if (collisions.length === 0) return undefined;
        else if (collisions.length === 1) return collisions[0];

        return new Collision(collisions[0].colliderA, collisions[0].colliderB, Vector2.average(...collisions.map(c => <Vector2>c.normal).filter(x => x)), collisions.reduce((t, c) => t += c.penetrationDepth || 0, 0) / collisions.length, collisions.reduce((t, c) => { t.push(...(c.contactPoints || [])); return t; }, <Vector2[]>[]));
    }
}

declare interface Solved {
    readonly collision: Collision;
    readonly A: Vector2;
    readonly B: Vector2;
}
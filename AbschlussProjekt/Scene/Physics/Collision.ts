import { Collider } from '../GameObject/Components/Collider.js';
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
        this.normal = normal?.normalized;
        this.penetrationDepth = penetrationDepth;
        this.contactPoints = contactPoints;
        if (this.normal && this.contactPoints && this.penetrationDepth) this.solved = this.solve();
    }
    private solve(): Solved | undefined {
        if (!this.normal) return;
        const rb1 = this.colliderA.gameObject.rigidbody;
        const rb2 = this.colliderB.gameObject.rigidbody;

        if (rb1.mass === 0 && rb2.mass === 0 || !this.normal || !this.contactPoints || !this.penetrationDepth) return;

        //const contact = Vector2.average(...this.contactPoints);
        //const ra = contact.clone.sub(this.colliderA.position);
        //const rb = contact.clone.sub(this.colliderB.position);

        //const rv = rb2.velocity.clone.add(Vector2.cross1(rb2.angularVelocity, rb)).sub(rb1.velocity).sub(Vector2.cross1(rb1.angularVelocity, ra));

        const velocityAlongNormal = Vector2.dot(rb1.velocity.clone.sub(rb2.velocity), this.normal);

        if (velocityAlongNormal > 0) return;


        const e = (this.colliderA.material.bounciness + this.colliderB.material.bounciness) / 2;

        const j = (-(e + 1) * velocityAlongNormal) / (rb1.invMass + rb2.invMass);


        const impulse = this.normal.normalized.setLength(j);

        return {
            collision: this,
            A: impulse,
            B: impulse.flipped
        };
    }
}

declare interface Solved {
    readonly collision: Collision;
    readonly A: Vector2;
    readonly B: Vector2;
}
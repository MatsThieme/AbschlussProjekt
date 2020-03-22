import { Collider } from '../GameObject/Components/Collider.js';
import { Vector2 } from '../Vector2.js';

export class Collision {
    public readonly A: Collider;
    public readonly B: Collider;
    public readonly normal: Vector2 | undefined;
    public readonly penetrationDepth: number | undefined;
    public readonly contactPoints: Vector2[] | undefined;
    public readonly solved: Solved | undefined;
    public readonly e: number;
    public readonly df: number;
    public readonly sf: number;

    public constructor(colliderA: Collider, colliderB: Collider, normal?: Vector2, penetrationDepth?: number, contactPoints?: Vector2[]) {
        this.A = colliderA;
        this.B = colliderB;
        this.normal = normal?.normalized;
        this.penetrationDepth = penetrationDepth;
        this.contactPoints = contactPoints;

        this.e = Math.min(this.A.material.bounciness, this.B.material.bounciness);

        this.sf = Math.sqrt(this.A.material.staticFriction ** 2 + this.B.material.staticFriction ** 2);
        this.df = Math.sqrt(this.A.material.dynamicFriction ** 2 + this.B.material.dynamicFriction ** 2);

        this.solved = this.solve();
    }
    private solve(): Solved | undefined {
        if (!this.normal) return;
        const rbA = this.A.gameObject.rigidbody;
        const rbB = this.B.gameObject.rigidbody;

        if (rbA.mass === 0 && rbB.mass === 0 || !this.normal || !this.contactPoints || !this.penetrationDepth) return;

        const contact = Vector2.average(...this.contactPoints);
        const ra = contact.clone.sub(this.A.position);
        const rb = contact.clone.sub(this.B.position);

        const t = this.normal.perpendicularClockwise;
        //const rv = rb2.velocity.clone.add(Vector2.cross1(rb2.angularVelocity, rb)).sub(rb1.velocity).sub(Vector2.cross1(rb1.angularVelocity, ra));

        //const velocityAlongNormal = Vector2.dot(rv, this.normal);

        let velocityAlongNormal = Vector2.dot(rbA.velocity.clone.sub(rbB.velocity), this.normal);

        if (velocityAlongNormal > 0) {
            this.normal.flip();
            velocityAlongNormal = velocityAlongNormal = Vector2.dot(rbA.velocity.clone.sub(rbB.velocity), this.normal);
            return;
        }



        if (velocityAlongNormal > 0) return;


        const j = (-(this.e + 1) * velocityAlongNormal) / (rbA.invMass + rbB.invMass + (Vector2.cross(ra, t) ** 2 / rbA.invInertia) + (Vector2.cross(rb, t) ** 2 / rbB.invInertia));

        const impulse = this.normal.clone.setLength(j);

        const project = this.normal.clone.setLength(this.penetrationDepth / 2);

        const projectA = rbB.mass === 0 ? project.clone.scale(2) : project;
        const projectB = rbA.mass === 0 ? project.clone.scale(2) : project;

        return {
            collision: this,
            A: {
                impulse,
                project: projectA
            },
            B: {
                impulse: impulse.flipped,
                project: projectB.flipped
            }
        };
    }
}


declare interface Solved {
    readonly collision: Collision;
    readonly A: {
        impulse: Vector2;
        project: Vector2;
    };
    readonly B: {
        impulse: Vector2;
        project: Vector2;
    };
}
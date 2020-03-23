import { Collider } from '../GameObject/Components/Collider.js';
import { Vector2 } from '../Vector2.js';
import { Physics } from './Physics.js';

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

        this.e = (this.A.material.bounciness + this.B.material.bounciness) / 2;

        this.sf = (this.A.material.staticFriction + this.B.material.staticFriction) / 2;
        this.df = (this.A.material.dynamicFriction + this.B.material.dynamicFriction) / 2;

        this.solved = this.solve();
    }
    private solve(): Solved | undefined {
        if (!this.normal) return;
        const rbA = this.A.gameObject.rigidbody;
        const rbB = this.B.gameObject.rigidbody;

        if (rbA.mass === 0 && rbB.mass === 0 || !this.normal || !this.contactPoints || !this.penetrationDepth) return;

        const impulsesA: { impulse: Vector2, at: Vector2 }[] = [];
        const impulsesB: { impulse: Vector2, at: Vector2 }[] = [];

        //debugger;

        for (let i = 0; i < this.contactPoints.length; ++i) {
            const ra: Vector2 = this.A.position.sub(this.contactPoints[i]);
            const rb: Vector2 = this.B.position.sub(this.contactPoints[i]);


            let rv: Vector2 = rbB.velocity.clone.add(Vector2.cross1(rbB.angularVelocity, rb)).sub(rbA.velocity).sub(Vector2.cross1(rbA.angularVelocity, ra));

            const contactVel = Vector2.dot(rv, this.normal);

            if (contactVel > 0) continue;

            const raCrossN = Vector2.cross(ra, this.normal);
            const rbCrossN = Vector2.cross(rb, this.normal);
            const invMassSum = rbA.invMass + rbB.invMass + raCrossN ** 2 * rbA.invInertia + rbCrossN ** 2 * rbB.invInertia;

            let j = -(1 + this.e) * contactVel;
            j /= invMassSum;
            j /= this.contactPoints.length;

            const impulse = this.normal.normalized.scale(j);


            impulsesA.push({ impulse: impulse.flipped.scale(rbB.mass === 0 ? 2 : 1), at: ra });
            impulsesB.push({ impulse: impulse.clone.scale(rbA.mass === 0 ? 2 : 1), at: rb });


            rv = rbB.velocity.clone.add(Vector2.cross1(rbB.angularVelocity, rb)).sub(rbA.velocity).sub(Vector2.cross1(rbA.angularVelocity, ra));

            const t = rv.clone;
            const xyz = -Vector2.dot(rv, this.normal);
            t.add(this.normal.clone.scale(xyz));
            t.normalize();

            let jt = -Vector2.dot(rv, t);
            jt /= invMassSum;
            jt /= this.contactPoints.length;

            if (jt === 0) continue;

            let tangentImpulse;
            if (Math.abs(jt) < j * this.sf) tangentImpulse = t.scale(jt);
            else tangentImpulse = t.scale(-this.df * j);


            impulsesA.push({ impulse: tangentImpulse.flipped.scale(rbB.mass === 0 ? 2 : 1), at: ra });
            impulsesB.push({ impulse: tangentImpulse.clone.scale(rbA.mass === 0 ? 2 : 1), at: rb });
        }


        const project = this.normal.clone.setLength(this.penetrationDepth / 2);

        return {
            collision: this,
            A: {
                impulses: impulsesA,
                project: (rbB.mass === 0 ? project.clone.scale(2) : project).flipped
            },
            B: {
                impulses: impulsesB,
                project: rbA.mass === 0 ? project.clone.scale(2) : project
            }
        };
    }
}

declare interface Solved {
    readonly collision: Collision;
    readonly A: {
        impulses: { impulse: Vector2, at: Vector2 }[];
        project: Vector2;
    };
    readonly B: {
        impulses: { impulse: Vector2, at: Vector2 }[];
        project: Vector2;
    };
}
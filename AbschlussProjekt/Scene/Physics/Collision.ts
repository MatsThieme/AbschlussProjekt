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

        const rv = rbA.velocity.clone.add(Vector2.cross1(rbA.angularVelocity, ra)).sub(rbB.velocity.clone.add(Vector2.cross1(rbB.angularVelocity, rb)));

        const velocityAlongNormal = Vector2.dot(rv, this.normal);

        //let velocityAlongNormal = Vector2.dot(rbA.velocity.clone.sub(rbB.velocity), this.normal);

        if (velocityAlongNormal > 0) return; //


        const j = (-(this.e + 1) * velocityAlongNormal) / (Vector2.dot(this.normal, this.normal) * (rbA.invMass + rbB.invMass + (Vector2.dot(ra, this.normal) ** 2 / rbA.invInertia) + (Vector2.dot(rb, this.normal) ** 2 / rbB.invInertia)));//+ (Vector2.cross(ra, this.normal) ** 2 / rbA.invInertia) + (Vector2.cross(rb, this.normal) ** 2 / rbB.invInertia)

        const impulse = this.normal.clone.setLength(j);

        const project = this.normal.clone.setLength(this.penetrationDepth / 2);

        //console.log(rbA.velocity.magnitude < Physics.gravity.magnitude * 10, rbB.velocity.magnitude < Physics.gravity.magnitude * 10);


        return {
            collision: this,
            A: {
                impulse: /*rbA.velocity.magnitude < Physics.gravity.magnitude ? rbA.velocity.flipped : */impulse,
                project: rbB.mass === 0 ? project.clone.scale(2) : project
            },
            B: {
                impulse: /*rbB.velocity.magnitude < Physics.gravity.magnitude ? rbB.velocity.flipped : */impulse.flipped,
                project: rbA.mass === 0 ? project.flipped.scale(2) : project.flipped
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
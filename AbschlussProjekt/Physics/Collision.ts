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
        if (this.normal && this.contactPoints && this.penetrationDepth) this.solved = Collision.solve(this);
    }
    public static solve(collision: Collision): Solved | undefined {
        if (!collision.normal) return;
        const rb1 = collision.colliderA.gameObject.rigidbody;
        const rb2 = collision.colliderB.gameObject.rigidbody;

        if (rb1.mass === 0 && rb2.mass === 0 || !collision.normal || !collision.contactPoints || !collision.penetrationDepth) return;

        const rv = rb1.velocity.sub(rb2.velocity);
        const velocityAlongNormal = Vector2.dot(rv, collision.normal);

        if (velocityAlongNormal > 0) return;

        const e = (collision.colliderA.material.bounciness + collision.colliderB.material.bounciness) / 2;

        const j = (-e * velocityAlongNormal) / (rb1.invMass + rb2.invMass);

        return {
            collision,
            A: collision.normal.clone.scale(j),
            B: collision.normal.clone.scale(-j)
        };






        ////Vec2 rv = VB - VA
        //const rv = rb1.velocity.sub(rb2.velocity);


        //let velAlongNormal = Vector2.dot(rv, collision.normal);

        //if (velAlongNormal > 0) return;

        //const e = (collision.colliderA.material.bounciness + collision.colliderB.material.bounciness) / 2;

        //let j = ((-(1 + e) * velAlongNormal) / (rb1.invMass / (rb2.invMass || 1))) * collision.penetrationDepth;


        //// Solve for the tangent vector
        ////Vec2 tangent = rv - Dot(rv, normal) * normal
        //const tangent = rv.clone.sub(collision.normal.clone.scale(Vector2.dot(rv, collision.normal)));
        //tangent.normalize();

        //// Solve for magnitude to apply along the friction vector
        ////float jt = -Dot(rv, t)
        //const t = collision.normal.perpendicularClockwise;
        //let jt = -Vector2.dot(rv, t);
        //jt = jt / (rb1.invMass + rb2.invMass);

        //// PythagoreanSolve = A^2 + B^2 = C^2, solving for C given A and B
        //// Use to approximate mu given friction coefficients of each body
        //const mu = Math.sqrt(collision.colliderA.material.staticFriction ** 2 + collision.colliderB.material.staticFriction ** 2);

        //// Clamp magnitude of friction and create impulse vector
        //let frictionImpulse: Vector2;

        //if (Math.abs(jt) < j * mu)
        //    frictionImpulse = t.clone.scale(jt);
        //else {
        //    let dynamicFriction = Math.sqrt(collision.colliderA.material.dynamicFriction ** 2 + collision.colliderB.material.dynamicFriction ** 2);
        //    frictionImpulse = t.clone.scale(-j * dynamicFriction);
        //}

        ////// Apply
        ////A -> velocity -= (1 / A -> mass) * frictionImpulse
        ////B -> velocity += (1 / B -> mass) * frictionImpulse

        ////debugger;

        //return {
        //    collision,
        //    A: frictionImpulse.clone.scale(-rb1.invMass),
        //    B: frictionImpulse.clone.scale(rb2.invMass)
        //};
















        //const sf = Math.sqrt(collision.colliderA.material.staticFriction * collision.colliderB.material.staticFriction);
        //const df = Math.sqrt(collision.colliderA.material.dynamicFriction * collision.colliderB.material.dynamicFriction);








        //const e = (collision.colliderA.material.bounciness + collision.colliderB.material.bounciness) / 2;



        //const aimpulses: { impulse: Vector2, point: Vector2 }[] = [];
        //const bimpulses: { impulse: Vector2, point: Vector2 }[] = [];


        //for (let i = 0; i < collision.contactPoints.length; ++i) {
        //    const ra = collision.contactPoints[i].clone.sub(rb1.centerOfMass);
        //    const rb = collision.contactPoints[i].clone.sub(rb2.centerOfMass);

        //    let rv = rb2.velocity.clone.add(Vector2.cross1(rb2.angularVelocity, rb)).sub(rb1.velocity.clone.sub(Vector2.cross1(rb1.angularVelocity, ra)));

        //    const contactVel = Vector2.dot(rv, collision.normal);


        //    //if (contactVel > 0) continue;

        //    const raCrossN = Vector2.cross(ra, collision.normal);
        //    const rbCrossN = Vector2.cross(rb, collision.normal);
        //    const invMassSum = rb1.invMass + rb2.invMass + raCrossN ** 2 * rb1.invInertia + rbCrossN ** 2 * rb2.invInertia;

        //    let j = -(1 + e) * contactVel;
        //    j /= invMassSum;
        //    j /= collision.contactPoints.length;

        //    const impulse = collision.normal.clone.scale(j);
        //    aimpulses.push({ impulse: impulse.clone.scale(-1), point: ra });
        //    bimpulses.push({ impulse: impulse.clone, point: rb });



        //// Friction impulse
        //rv = rb2.velocity.clone.sub(Vector2.cross1(rb2.angularVelocity, rb)).sub(rb1.velocity.clone.sub(Vector2.cross1(rb1.angularVelocity, ra)));
        //const t = collision.normal.perpendicularClockwise;
        //const xt = rv.clone.sub(collision.normal.clone.scale(Vector2.dot(rv, collision.normal)));
        //console.log(collision.normal.clone.scale(Vector2.dot(rv, collision.normal)));
        //t.normalize();
        //xt.normalize();

        //debugger;

        //// j tangent magnitude
        //let jt = -Vector2.dot(rv, t);
        //jt /= invMassSum;
        //jt /= collision.contactPoints.length;

        //// Don't apply tiny friction impulses
        ////if (Equal(jt, 0.0f))


        //if (jt === 0) continue;

        //// Coulumb's law
        //let tangentImpulse: Vector2;
        //if (Math.abs(jt) < j * sf) tangentImpulse = t.clone.scale(jt);
        //else tangentImpulse = t.clone.scale(-j * df);


        //aimpulses.push({ impulse: tangentImpulse.clone.scale(-1), point: ra });
        //bimpulses.push({ impulse: tangentImpulse.clone, point: rb });

        //}

        //debugger;

        //return {
        //    collision,
        //    A: aimpulses,
        //    B: bimpulses
        //};
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
import { GameObject } from '../GameObject.js';
import { GameTime } from '../GameTime.js';
import { Collision } from '../Physics/Collision.js';
import { Physics } from '../Physics/Physics.js';
import { PhysicsMaterial } from '../Physics/PhysicsMaterial.js';
import { Vector2 } from '../Vector2.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';
import { Collider } from './Collider.js';

export class RigidBody extends Component {
    private _mass: number;
    public material: PhysicsMaterial;
    public velocity: Vector2;
    public angularVelocity: number;
    public torque: number;
    public force: Vector2;
    public constructor(gameObject: GameObject, mass: number = 0, material: PhysicsMaterial = new PhysicsMaterial()) {
        super(gameObject, ComponentType.RigidBody);
        this._mass = mass;
        this.material = material;
        this.velocity = new Vector2();
        this.angularVelocity = 0;
        this.torque = 0;
        this.force = new Vector2();
    }
    public get mass(): number {
        return this._mass;
    }
    public get invMass(): number {
        return this.mass === 0 ? 0 : 1 / this.mass;
    }
    public get invInertia(): number {
        return 1 / this.inertia;
    }
    public set mass(val: number) {
        this._mass = val;
        this.velocity = new Vector2();
    }
    public get centerOfMass(): Vector2 {
        return Vector2.average(...this.gameObject.getComponents<Collider>(ComponentType.Collider).map(c => c.position));
    }
    public get autoMass(): number {
        return this.gameObject.getComponents<Collider>(ComponentType.Collider).reduce((t, c) => t += c.autoMass, 0);
    }
    public get inertia(): number {
        const collider = this.gameObject.getComponents<Collider>(ComponentType.Collider);
        if (collider.length === 0) return 0;

        const r = (collider.reduce((t, c) => { t += c.area; return t; }, 0) / Math.PI) ** 0.5;
        return (Math.PI * r ** 4) / 4;
    }
    public applyImpulse(impulse: Vector2, at: Vector2): void {
        this.force.add(impulse);
        this.torque += this.invInertia * Vector2.cross(this.centerOfMass.add(at), impulse);
    }
    public update(gameTime: GameTime, currentCollisions: Collision[]): void {
        if (this.mass === 0) return;

        const solvedCollisions = [];
        const collisionPoint = new Vector2();

        for (const collision of currentCollisions) {
            if (collision.solved) {
                if (collision.colliderA.gameObject.id === this.gameObject.id) {
                    solvedCollisions.push(collision.solved.A);
                    if (collision.contactPoints) collisionPoint.add(...collision.contactPoints);
                } else if (collision.colliderB.gameObject.id === this.gameObject.id) {
                    solvedCollisions.push(collision.solved.B);
                    if (collision.contactPoints) collisionPoint.add(...collision.contactPoints);
                }
            }
        }

        if (solvedCollisions.length > 0) this.applyImpulse(Vector2.average(...solvedCollisions), Vector2.divide(collisionPoint, solvedCollisions.length));

        this.force.add(Physics.gravity);
        this.velocity.add(this.force.clone.scale(this.invMass * gameTime.deltaTime * Physics.timeScale));
        this.force = new Vector2();

        this.angularVelocity += this.torque * this.invInertia * gameTime.deltaTime * Physics.timeScale;
        this.gameObject.transform.relativePosition.add(this.velocity.clone.scale(gameTime.deltaTime * Physics.timeScale));
        this.gameObject.transform.relativeRotation.radian += this.angularVelocity * gameTime.deltaTime * Physics.timeScale;
    }
}
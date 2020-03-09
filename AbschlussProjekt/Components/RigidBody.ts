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
    private _invMass: number;
    private _inertia: number;
    private _invInertia: number;
    public material: PhysicsMaterial;
    public velocity: Vector2;
    public angularVelocity: number;
    public torque: number;
    public force: Vector2;
    public constructor(gameObject: GameObject, mass: number = 0, material: PhysicsMaterial = new PhysicsMaterial()) {
        super(gameObject, ComponentType.RigidBody);
        this._mass = mass;
        this._invMass = mass === 0 ? 0 : 1 / mass;
        this.material = material;
        this.velocity = new Vector2();
        this.angularVelocity = 0;
        this.torque = 0;
        this.force = new Vector2();
        this._inertia = 0;
        this._invInertia = 0;
    }
    public get mass(): number {
        return this._mass;
    }
    public get invMass(): number {
        return this._invMass;
    }
    public get inertia(): number {
        return this._inertia;
    }
    public get invInertia(): number {
        if (this._invInertia === 0) this._invInertia = this.inertia !== 0 ? 1 / this.inertia : 0;
        return this._invInertia;
    }
    public set mass(val: number) {
        this._mass = val;
        this._invMass = val === 0 ? 0 : 1 / val;
        this.velocity = new Vector2();
    }
    public get centerOfMass(): Vector2 {
        return Vector2.average(...this.gameObject.getComponents<Collider>(ComponentType.Collider).map(c => c.position));
    }
    public get autoMass(): number {
        return this.gameObject.getComponents<Collider>(ComponentType.Collider).reduce((t, c) => t += c.autoMass, 0);
    }
    public applyImpulse(impulse: Vector2, at: Vector2): void {
        this.force.add(impulse.clone.scale(this.invMass));
        this.torque += this.invInertia * Vector2.cross(at, impulse);
    }
    public update(gameTime: GameTime, currentCollisions: Collision[]): void {
        //if (this.mass === 0) return;

        //const solvedCollisions = [];

        //for (const collision of currentCollisions) {
        //    if (collision.solved) {
        //        if (collision.colliderA.gameObject.id === this.gameObject.id) {
        //            solvedCollisions.push(collision.solved.A);
        //        } else if (collision.colliderB.gameObject.id === this.gameObject.id) {
        //            solvedCollisions.push(collision.solved.B);
        //        }
        //    }
        //}

        //if (solvedCollisions.length > 0) this.applyImpulse(Vector2.average(...solvedCollisions), this.centerOfMass);

        //this.force.add(Physics.gravity);
        //this.velocity.add(this.force.clone.scale(this.invMass * gameTime.deltaTime * Physics.timeScale));
        //this.angularVelocity += this.torque * this.invInertia * gameTime.deltaTime * Physics.timeScale;
        //this.gameObject.transform.relativePosition.add(this.velocity.clone.scale(gameTime.deltaTime * Physics.timeScale));
        //this.gameObject.transform.relativeRotation.radian += this.angularVelocity * gameTime.deltaTime * Physics.timeScale;
        //this.force = new Vector2();
    }
}
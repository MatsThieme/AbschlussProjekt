import { GameObject } from '../GameObject.js';
import { GameTime } from '../GameTime.js';
import { Collision } from '../Physics/Collision.js';
import { PhysicsMaterial } from '../Physics/PhysicsMaterial.js';
import { Vector2 } from '../Vector2.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';

export class RigidBody extends Component {
    private _mass: number;
    private _invMass: number;
    public material: PhysicsMaterial;
    public velocity: Vector2;
    public angularVelocity: Vector2;
    private velocityChange: Vector2;
    private angularVelocityChange: Vector2;
    public constructor(gameObject: GameObject, mass: number = 0, material: PhysicsMaterial = new PhysicsMaterial()) {
        super(gameObject, ComponentType.RigidBody);
        this._mass = mass;
        this._invMass = mass === 0 ? 0 : 1 / mass;
        this.material = material;
        this.velocity = new Vector2(0, 0);
        this.angularVelocity = new Vector2();
        this.velocityChange = new Vector2();
        this.angularVelocityChange = new Vector2();
    }
    public get mass(): number {
        return this._mass;
    }
    public get invMass(): number {
        return this._invMass;
    }
    public set mass(val: number) {
        this._mass = val;
        this._invMass = val === 0 ? 0 : 1 / val;
        this.velocityChange = new Vector2();
    }
    public impulse(impulse: Vector2): void {
        this.velocityChange.add(impulse);
    }
    public update(gameTime: GameTime, currentCollisions: Collision[]): void {
        if (this.mass === 0) return;
        for (const collision of currentCollisions) {
            if (collision.colliderA.gameObject.id === this.gameObject.id) {
                if (!collision.solved) continue;
                collision.solved.A.velocity.y *= -1;
                this.impulse(collision.solved.A.velocity);
                this.velocity = new Vector2();
            } else if (collision.colliderB.gameObject.id === this.gameObject.id) {
                if (!collision.solved) continue;
                collision.solved.B.velocity.y *= -1;
                this.impulse(collision.solved.B.velocity);
                this.velocity = new Vector2();
            }
        }

        this.velocity.add(this.velocityChange);
        this.velocityChange = new Vector2();
    }
}
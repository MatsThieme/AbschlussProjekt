import { GameObject } from '../GameObject.js';
import { GameTime } from '../GameTime.js';
import { Collision } from '../Physics/Collision.js';
import { Physics } from '../Physics/Physics.js';
import { PhysicsMaterial } from '../Physics/PhysicsMaterial.js';
import { Solver } from '../Physics/Solver.js';
import { Vector2 } from '../Vector2.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';

export class RigidBody extends Component {
    private _mass: number;
    private _invMass: number;
    public material: PhysicsMaterial;
    public velocity: Vector2;
    private angularVelocity: Vector2;
    private velocityChange: Vector2;
    private angularVelocityChange: Vector2;
    public constructor(gameObject: GameObject, mass: number = 0, material: PhysicsMaterial = new PhysicsMaterial()) {
        super(gameObject, ComponentType.RigidBody);
        this._mass = mass;
        this._invMass = mass === 0 ? 0 : 1 / mass;
        this.material = material;
        this.velocity = new Vector2();
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
            if (collision.gameObjectA.id === this.gameObject.id) {
                const solved = Solver.solve(collision);
                if (!solved) continue;
                //solved.B.velocity.y *= -1;
                this.impulse(solved.A.velocity);
                this.velocity = new Vector2();
            } else if (collision.gameObjectB.id === this.gameObject.id) {
                const solved = Solver.solve(collision);
                if (!solved) continue;
                //solved.A.velocity.y *= -1;
                this.impulse(solved.B.velocity);
                this.velocity = new Vector2();
            }
        }


        this.velocity.add(this.velocityChange, Physics.gravity.clone.scale(gameTime.deltaTime * this.mass));
        this.velocityChange = new Vector2();
    }
}
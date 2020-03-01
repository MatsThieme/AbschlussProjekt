import { GameObject } from '../GameObject.js';
import { PhysicsMaterial } from '../Physics/PhysicsMaterial.js';
import { Vector2 } from '../Vector2.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';

export class RigidBody extends Component {
    private _mass: number;
    private _invMass: number;
    public material: PhysicsMaterial;
    public velocity: Vector2;
    public constructor(gameObject: GameObject, mass: number = 1, material: PhysicsMaterial = new PhysicsMaterial()) {
        super(gameObject, ComponentType.RigidBody);
        this._mass = mass;
        this._invMass = mass === 0 ? 0 : 1 / mass;
        this.material = material;
        this.velocity = new Vector2();
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
    }
}
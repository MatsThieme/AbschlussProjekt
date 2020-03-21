import { GameTime } from '../../GameTime.js';
import { Collision } from '../../Physics/Collision.js';
import { Physics } from '../../Physics/Physics.js';
import { Sprite } from '../../Sprite.js';
import { Vector2 } from '../../Vector2.js';
import { Destroy } from '../Behaviours/Destroy.js';
import { GameObject } from '../GameObject.js';
import { CircleCollider } from './CircleCollider.js';
import { Collider } from './Collider.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';
import { PolygonCollider } from './PolygonCollider.js';
import { Texture } from './Texture.js';

export class RigidBody extends Component {
    private _mass: number;
    private _inertia: number;
    public velocity: Vector2;
    public angularVelocity: number;
    public torque: number;
    public force: Vector2;
    public useAutoMass: boolean;
    public constructor(gameObject: GameObject, mass: number = 0, useAutoMass: boolean = false) {
        super(gameObject, ComponentType.RigidBody);
        this._mass = mass;
        this.useAutoMass = useAutoMass;
        this.velocity = new Vector2();
        this.angularVelocity = 0;
        this.torque = 0;
        this.force = new Vector2();
        this._inertia = this.computeInertia();
    }
    public get mass(): number {
        return this.useAutoMass ? this.autoMass : this._mass;
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
        return this._inertia;
    }
    private computeInertia(): number {
        const collider = this.gameObject.getComponents<CircleCollider | PolygonCollider>(ComponentType.Collider);
        if (collider.length === 0) return 0;

        let inertia = 0;
        for (const c of collider) {
            if (c.type === ComponentType.CircleCollider) {
                inertia += 0.5 * this.mass * (<CircleCollider>c).radius ** 2;
            } else if (c.type === ComponentType.PolygonCollider && 'vertices' in c) {

                for (let i = 0; i < c.vertices.length - 1; i++) {
                    const A = c.vertices[i];
                    const B = c.vertices[i + 1];

                    const mass_tri = c.density * 0.5 * Math.abs(Vector2.cross(A, B));
                    const inertia_tri = mass_tri * (A.magnitudeSquared + B.magnitudeSquared + Vector2.dot(A, B)) / 6;
                    inertia += inertia_tri;
                }

            }
        }

        return inertia;
    }
    public updateInertia(): void {
        this._inertia = this.computeInertia();
    }
    public applyImpulse(impulse: Vector2, at: Vector2): void {
        this.velocity.add(impulse.clone.scale(this.invMass));
        //this.angularVelocity += this.invInertia * Vector2.cross(at, impulse);
    }
    public update(gameTime: GameTime, currentCollisions: Collision[]): void {
        if (this.mass === 0) return;

        //this.force.add(Physics.gravity);


        const solvedCollisions = [];
        const contactPoints = [];
        const normals: Vector2[] = [];

        for (const collision of currentCollisions) {
            if (collision.solved) {
                if (collision.colliderA.gameObject.id === this.gameObject.id) {
                    solvedCollisions.push(collision.solved.A);
                    if (collision.normal) normals.push(collision.normal);
                    if (collision.contactPoints) contactPoints.push(...collision.contactPoints);
                } else if (collision.colliderB.gameObject.id === this.gameObject.id) {
                    solvedCollisions.push(collision.solved.B);
                    if (collision.normal) normals.push(collision.normal);
                    if (collision.contactPoints) contactPoints.push(...collision.contactPoints);
                }
            }
        }

        if (solvedCollisions.length > 0) {
            this.applyImpulse(Vector2.average(...solvedCollisions), Vector2.average(...contactPoints));



            for (const c of contactPoints) {
                this.gameObject.scene.newGameObject('contact', gameObject => {
                    gameObject.addComponent(Texture, texture => {
                        texture.sprite = new Sprite('spriteTest1.png');
                        texture.size = new Vector2(0.1, 0.1);
                    });

                    gameObject.transform.relativePosition = c;
                    gameObject.addComponent(Destroy);
                });
            }

            for (const n of normals) {
                this.gameObject.scene.newGameObject('contact', gameObject => {
                    gameObject.addComponent(Texture, texture => {
                        texture.sprite = new Sprite((context, canvas) => {
                            canvas.width = canvas.height = 50;

                            context.arc(canvas.width / 2, 8, 8, 0, Math.PI * 2);
                            context.fillStyle = context.strokeStyle = '#f00';
                            context.fill();

                            context.beginPath();

                            context.moveTo(canvas.width / 2, 8);
                            context.lineTo(canvas.width / 2, canvas.height);
                            context.stroke();
                        });

                        texture.size = new Vector2(0.5, 0.5);
                    });

                    gameObject.transform.relativeRotation = Vector2.up.angleTo(Vector2.zero, n);
                    gameObject.addComponent(Destroy);
                });
            }
        }


        this.velocity.add(this.force.clone.scale(this.invMass * gameTime.deltaTime * Physics.timeScale));
        this.force = Vector2.zero;

        this.angularVelocity += this.torque * this.invInertia * gameTime.deltaTime * Physics.timeScale;
        this.torque = 0;


        this.gameObject.transform.relativePosition.add(this.velocity.clone.scale(gameTime.deltaTime * Physics.timeScale));
        this.gameObject.transform.relativeRotation.radian += this.angularVelocity * gameTime.deltaTime * Physics.timeScale;
    }
}
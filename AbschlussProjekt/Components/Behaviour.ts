import { GameObject } from '../GameObject.js';
import { GameTime } from '../GameTime.js';
import { Input } from '../Input/Input.js';
import { Collision } from '../Physics/Collision.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';

export class Behaviour extends Component {
    protected input: Input;
    public readonly name: string;
    public constructor(gameObject: GameObject) {
        super(gameObject, ComponentType.Behaviour);
        this.input = gameObject.scene.input;
        this.name = this.constructor.name;
        this.start();
    }
    protected start() {

    }
    public update(gameTime: GameTime) {

    }
    public onCollision(collisions: Collision[]) {

    }
}
import { GameObject } from '../GameObject.js';
import { GameTime } from '../GameTime.js';
import { Collision } from '../Physics/Collision.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';

export class Behaviour extends Component {
    public constructor(gameObject: GameObject) {
        super(gameObject, ComponentType.Behaviour);

        this.start();
    }
    public start() {

    }
    public update(gameTime: GameTime) {

    }
    public onCollision(collisions: Collision[]) {

    }
}
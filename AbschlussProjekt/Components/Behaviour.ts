import { GameObject } from '../GameObject.js';
import { GameTime } from '../GameTime.js';
import { Component } from './Component.js';

export class Behaviour extends Component {
    public constructor(gameObject: GameObject) {
        super(gameObject);

        this.start();
    }
    public start() {

    }
    public update(gameTime: GameTime) {

    }
    public onCollision() {

    }
}
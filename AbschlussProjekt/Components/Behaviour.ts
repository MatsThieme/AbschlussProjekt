import { Component } from './Component.js';
import { GameObject } from '../GameObject.js';

export class Behaviour extends Component {
    public constructor(gameObject: GameObject) {
        super(gameObject);

        this.start();
    }
    public start() {

    }
    public update() {

    }
}
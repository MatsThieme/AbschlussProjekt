import { Vector2 } from '../Vector2.js';
import { Component } from './Component.js';
import { ComponentType } from './ComponentType.js';
export class Transform extends Component {
    constructor(gameObject) {
        super(gameObject, ComponentType.Transform);
        this.position = new Vector2();
        this.rotation = new Vector2();
        this.scale = new Vector2();
    }
}

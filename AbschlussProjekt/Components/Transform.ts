import { Vector2 } from '../Vector2.js';
import { Component } from './Component.js';
import { GameObject } from '../GameObject.js';
import { ComponentType } from './ComponentType.js';

export class Transform extends Component {
    public position: Vector2;
    public rotation: Vector2;
    public scale: Vector2;
    public constructor(gameObject: GameObject) {
        super(gameObject, ComponentType.Transform);
        this.position = new Vector2();
        this.rotation = new Vector2();
        this.scale = new Vector2();
    }
}
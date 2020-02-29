import { GameObject } from '../GameObject.js';
import { ComponentType } from './ComponentType.js';

export class Component {
    public readonly gameObject: GameObject;
    public readonly type: ComponentType;
    public constructor(gameObject: GameObject, type: ComponentType = ComponentType.Component) {
        this.gameObject = gameObject;
        this.type = type;
    }
    public start() {

    }
    public update() {

    }
}
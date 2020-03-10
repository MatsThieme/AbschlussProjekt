import { GameObject } from '../GameObject.js';
import { ComponentType } from './ComponentType.js';

export abstract class Component {
    public gameObject: GameObject;
    public readonly type: ComponentType;
    public constructor(gameObject: GameObject, type: ComponentType = ComponentType.Component) {
        this.gameObject = gameObject;
        this.type = type;
    }
}
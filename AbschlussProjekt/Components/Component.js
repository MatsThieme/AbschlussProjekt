import { ComponentType } from './ComponentType.js';
export class Component {
    constructor(gameObject, type = ComponentType.Component) {
        this.gameObject = gameObject;
        this.type = type;
    }
}

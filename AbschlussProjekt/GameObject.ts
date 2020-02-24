import { Component } from './Components/Component.js';
import { Transform } from './Components/Transform.js';

export class GameObject {
    private static gameObjects: Map<string, GameObject> = new Map();
    private static nextID: number = 0;
    public name: string;
    private components: Component[] = [];
    public readonly id: number;
    public transform: Transform;
    public constructor(name: string) {
        this.name = name;
        this.id = GameObject.nextID++;

        this.transform = this.addComponent(Transform);

        GameObject.gameObjects.set(name, this);
    }
    public static find(name: string): GameObject {
        return this.gameObjects.get(name);
    }
    public addComponent<T extends Component>(component: new (gameObject: GameObject) => T): T {
        let component_ = new component(this);

        this.components.push(component_);

        return component_;
    }
    public getComponents<T extends Component>(type: new (gameObject: GameObject) => T): T[] {
        return <T[]>this.components.filter((c: Component) => c instanceof type);
    }
    public getComponent<T extends Component>(type: new (gameObject: GameObject) => T): T {
        return this.getComponents<T>(type)[0];
    }
}
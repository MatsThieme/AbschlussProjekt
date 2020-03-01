import { Component } from './Components/Component.js';
import { Transform } from './Components/Transform.js';
import { GameTime } from './GameTime.js';
import { Behaviour } from './Components/Behaviour.js';
import { RigidBody } from './Components/RigidBody.js';
import { Vector2 } from './Vector2.js';

export class GameObject {
    private static nextID: number = 0;
    public name: string;
    private components: Component[] = [];
    public readonly id: number;
    public readonly transform: Transform;
    public children: GameObject[];
    public constructor(name: string) {
        this.name = name;
        this.id = GameObject.nextID++;
        this.transform = this.addComponent(Transform);
        this.children = [];
    }
    public addComponent<T extends Component>(type: new (gameObject: GameObject) => T): T {
        const component = new type(this);

        this.components.push(component);

        return component;
    }
    public getComponents<T extends Component>(type: new (gameObject: GameObject) => T): T[] {
        return <T[]>this.components.filter((c: Component) => c instanceof type);
    }
    public getComponent<T extends Component>(type: new (gameObject: GameObject) => T): T {
        return this.getComponents<T>(type)[0];
    }
    public addChild(gameObject: GameObject): GameObject {
        this.children.push(gameObject);

        return gameObject;
    }
    public update(gameTime: GameTime) {
        this.children.forEach(c => c.update(gameTime));

        // vorher collider und rigidbody updaten

        this.transform.position.add(this.getComponent(RigidBody)?.velocity.clone.scale(gameTime.deltaTime) || new Vector2());

        this.getComponents(Behaviour).forEach(c => c.update(gameTime));
    }
}
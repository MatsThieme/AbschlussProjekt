import { AnimatedSprite } from './Components/AnimatedSprite.js';
import { Behaviour } from './Components/Behaviour.js';
import { Camera } from './Components/Camera.js';
import { Component } from './Components/Component.js';
import { ComponentType } from './Components/ComponentType.js';
import { RigidBody } from './Components/RigidBody.js';
import { Transform } from './Components/Transform.js';
import { GameTime } from './GameTime.js';
import { Physics } from './Physics/Physics.js';

export class GameObject {
    private static nextID: number = 0;
    public name: string;
    private components: Component[] = [];
    public readonly id: number;
    public readonly transform: Transform;
    public children: GameObject[];
    public rigidbody: RigidBody;
    public active: boolean = true;
    public constructor(name: string) {
        this.name = name;
        this.id = GameObject.nextID++;
        this.transform = this.addComponent(Transform);
        this.rigidbody = this.addComponent(RigidBody);
        this.children = [];
    }
    public addComponent<T extends Component>(type: new (gameObject: GameObject) => T): T {
        const component = new type(this);

        if (!(component instanceof Camera) && !(component instanceof Transform) && !(component instanceof RigidBody) ||
            (component instanceof RigidBody && this.getComponents(RigidBody).length === 0) ||
            (component instanceof Transform && this.getComponents(Transform).length === 0) ||
            (component instanceof Camera && this.getComponents(Camera).length === 0))
            this.components.push(component);

        return component;
    }
    public getComponents<T extends Component>(type: (new (gameObject: GameObject) => T) | ComponentType): T[] {
        return <T[]>this.components.filter((c: Component) => {
            if (typeof type === 'number') {
                return c.type === type || type === ComponentType.Component || type === ComponentType.Collider && (c.type === ComponentType.BoxCollider || c.type === ComponentType.CircleCollider || c.type === ComponentType.CapsuleCollider);
            }

            return c instanceof <any>type;
        });
    }
    public getComponent<T extends Component>(type: (new (gameObject: GameObject) => T) | ComponentType): T {
        return this.getComponents<T>(type)[0];
    }
    public addChild(gameObject: GameObject): GameObject {
        this.children.push(gameObject);

        return gameObject;
    }
    public update(gameTime: GameTime) {
        if (!this.active) return;

        this.children.forEach(c => c.update(gameTime));

        if (this.rigidbody.mass > 0) this.transform.position.add(this.rigidbody.velocity.clone.scale(gameTime.deltaTime * Physics.timeScale));

        this.getComponents(Behaviour).forEach(c => c.update(gameTime));
        this.getComponents(AnimatedSprite).forEach(c => c.update(gameTime));
    }
}
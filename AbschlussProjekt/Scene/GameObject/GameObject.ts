import { awaitPromises } from '../../Helpers.js';
import { Transform } from '../GameObject/Components/Transform.js';
import { GameTime } from '../GameTime.js';
import { Collision } from '../Physics/Collision.js';
import { Scene } from '../Scene.js';
import { AnimatedSprite } from './Components/AnimatedSprite.js';
import { AudioListener } from './Components/AudioListener.js';
import { Behaviour } from './Components/Behaviour.js';
import { Collider } from './Components/Collider.js';
import { Component } from './Components/Component.js';
import { ComponentType } from './Components/ComponentType.js';
import { ParticleSystem } from './Components/ParticleSystem.js';
import { RigidBody } from './Components/RigidBody.js';

export class GameObject {
    private static nextID: number = 0;
    private _name: string;
    private components: Component[] = [];
    public readonly id: number;
    public children: GameObject[];
    public active: boolean = true;
    public scene: Scene;
    public parent: GameObject | undefined;
    public drawPriority: number;
    public hasCollider?: boolean;
    public constructor(name: string, scene: Scene) {
        this.id = GameObject.nextID++;
        this._name = `${name} (${this.id})`;
        this.addComponent(Transform);
        this.children = [];
        this.scene = scene;
        this.drawPriority = 0;
    }
    public get name(): string {
        return this._name;
    }
    public set name(val: string) {
        this._name = `${val} (${this.id})`;
    }
    public get transform(): Transform {
        return <Transform>this.getComponent<Transform>(ComponentType.Transform);
    }
    public get rigidbody(): RigidBody {
        return this.getComponent<RigidBody>(ComponentType.RigidBody) || this.getComponentInChildren<RigidBody>(ComponentType.RigidBody) || this.parent?.getComponent<RigidBody>(ComponentType.RigidBody) || this.addComponent(RigidBody);
    }
    public get collider(): Collider[] {
        return [...this.getComponents<Collider>(ComponentType.Collider), ...this.getComponentsInChildren<Collider>(ComponentType.Collider), ...this.getComponentsInParents<Collider>(ComponentType.Collider)];
    }
    public addComponent<T extends Component>(type: new (gameObject: GameObject) => T, cb?: (component: T) => any): T {
        const component = new type(this);

        if (component.type !== ComponentType.Camera && component.type !== ComponentType.Transform && component.type !== ComponentType.RigidBody && component.type !== ComponentType.AudioListener && component.type !== ComponentType.TileMap ||
            (component.type === ComponentType.RigidBody && this.getComponents(ComponentType.RigidBody).length === 0) ||
            (component.type === ComponentType.Transform && this.getComponents(ComponentType.Transform).length === 0) ||
            (component.type === ComponentType.Camera && this.getComponents(ComponentType.Camera).length === 0) ||
            (component.type === ComponentType.AudioListener && !this.scene.hasAudioListener) ||
            (component.type === ComponentType.TileMap && this.getComponents(ComponentType.TileMap).length === 0))
            this.components.push(component);

        if ((component.type === ComponentType.CircleCollider || component.type === ComponentType.PolygonCollider) && !this.rigidbody) this.addComponent(RigidBody);

        if (component.type === ComponentType.CircleCollider || component.type === ComponentType.PolygonCollider) this.hasCollider = true;

        if (component.type === ComponentType.AudioListener) this.scene.hasAudioListener = true;

        if (cb) cb(component);

        return component;
    }
    public getComponents<T extends Component>(type: (new (gameObject: GameObject) => T) | ComponentType): T[] {
        return <T[]>this.components.filter((c: Component) => {
            if (typeof type === 'number') {
                return c.type === type || type === ComponentType.Component || type === ComponentType.Collider && (c.type === ComponentType.CircleCollider || c.type === ComponentType.PolygonCollider);
            }

            return c instanceof <any>type;
        });
    }
    public getComponent<T extends Component>(type: (new (gameObject: GameObject) => T) | ComponentType): T | undefined {
        for (const c of this.components) {
            if (typeof type === 'number') {
                if (c.type === type || type === ComponentType.Component || type === ComponentType.Collider && (c.type === ComponentType.CircleCollider || c.type === ComponentType.PolygonCollider)) return <T>c;
                continue;
            }

            if (c instanceof <any>type) return <T>c;
        }

        return;
    }
    public getComponentsInChildren<T extends Component>(type: (new (gameObject: GameObject) => T) | ComponentType): T[] {
        const ret: T[] = [];

        for (const child of this.children) {
            ret.push(...child.getComponents(type));
            ret.push(...child.getComponentsInChildren(type));
        }

        return ret;
    }
    public getComponentInChildren<T extends Component>(type: (new (gameObject: GameObject) => T) | ComponentType): T | undefined {
        for (const child of this.children) {
            let c = child.getComponent(type);
            if (c) return c;
            c = child.getComponentInChildren(type);
            if (c) return c;
        }

        return undefined;
    }
    public getComponentsInParents<T extends Component>(type: (new (gameObject: GameObject) => T) | ComponentType): T[] {
        return [...(this.parent?.getComponents(type) || []), ...(this.parent?.getComponentsInParents(type) || [])];
    }
    public getComponentInParents<T extends Component>(type: (new (gameObject: GameObject) => T) | ComponentType): T | undefined {
        return this.parent?.getComponent(type) || this.parent?.getComponentInParents(type);
    }
    public addChild(gameObject: GameObject): GameObject {
        this.children.push(gameObject);
        gameObject.parent = this;
        return gameObject;
    }
    public async update(gameTime: GameTime, currentCollisions: Collision[]): Promise<void> {
        if (!this.active) return;

        this.children.forEach(c => c.update(gameTime, currentCollisions));


        const behaviours = this.getComponents<Behaviour>(ComponentType.Behaviour);
        behaviours.forEach(b => (x => x.length > 0 ? b.onCollision(x) : 0)(currentCollisions.filter(c => c.A.gameObject.id === this.id || c.B.gameObject.id === this.id))); // onCollision in behaviours aufrufen

        await awaitPromises(...behaviours.map(c => c.update(gameTime)));

        this.getComponents<ParticleSystem>(ComponentType.ParticleSystem).forEach(p => p.update(gameTime));
        this.getComponents<AnimatedSprite>(ComponentType.AnimatedSprite).forEach(c => c.update(gameTime));
        this.getComponent<AudioListener>(ComponentType.AudioListener)?.update();
    }
    public destroy(): void {
        this.scene.destroyGameObject(this.name);
    }
}
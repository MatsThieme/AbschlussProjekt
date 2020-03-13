import { AnimatedSprite } from './Components/AnimatedSprite.js';
import { AudioListener } from './Components/AudioListener.js';
import { Behaviour } from './Components/Behaviour.js';
import { Component } from './Components/Component.js';
import { ComponentType } from './Components/ComponentType.js';
import { ParticleSystem } from './Components/ParticleSystem.js';
import { RigidBody } from './Components/RigidBody.js';
import { Transform } from './Components/Transform.js';
import { GameTime } from './GameTime.js';
import { Collision } from './Physics/Collision.js';
import { Physics } from './Physics/Physics.js';
import { Scene } from './Scene.js';
import { Vector2 } from './Vector2.js';
import { PolygonRenderer } from './Components/PolygonRenderer.js';

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
    public constructor(name: string, scene: Scene) {
        this.id = GameObject.nextID++;
        this._name = `${name} (${this.id})`;
        this.addComponent(Transform);
        this.addComponent(RigidBody);
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
        return this.getComponent(Transform);
    }
    public get rigidbody(): RigidBody {
        return this.getComponent(RigidBody);
    }
    public addComponent<T extends Component>(type: new (gameObject: GameObject) => T): T {
        const component = new type(this);

        if (component.type !== ComponentType.Camera && component.type !== ComponentType.Transform && component.type !== ComponentType.RigidBody && component.type !== ComponentType.AudioListener && component.type !== ComponentType.TileMap ||
            (component.type === ComponentType.RigidBody && this.getComponents(ComponentType.RigidBody).length === 0) ||
            (component.type === ComponentType.Transform && this.getComponents(ComponentType.Transform).length === 0) ||
            (component.type === ComponentType.Camera && this.getComponents(ComponentType.Camera).length === 0) ||
            (component.type === ComponentType.AudioListener && this.getComponents(ComponentType.AudioListener).length === 0) ||
            (component.type === ComponentType.TileMap && this.getComponents(ComponentType.TileMap).length === 0))
            this.components.push(component);

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
    public getComponent<T extends Component>(type: (new (gameObject: GameObject) => T) | ComponentType): T {
        return this.getComponents<T>(type)[0];
    }
    public addChild(gameObject: GameObject): GameObject {
        this.children.push(gameObject);
        gameObject.parent = this;
        return gameObject;
    }
    public update(gameTime: GameTime, currentCollisions: Collision[]) {
        if (!this.active) return;

        this.children.forEach(c => c.update(gameTime, currentCollisions));


        const behaviours = this.getComponents<Behaviour>(ComponentType.Behaviour);
        behaviours.forEach(b => (x => x.length > 0 ? b.onCollision(x) : 0)(currentCollisions.filter(c => c.colliderA.gameObject.id === this.id || c.colliderB.gameObject.id === this.id))); // onCollision in behaviours aufrufen
        behaviours.forEach(c => c.update(gameTime));

        this.getComponents<ParticleSystem>(ComponentType.ParticleSystem).forEach(p => p.update(gameTime));
        this.getComponents<AnimatedSprite>(ComponentType.AnimatedSprite).forEach(c => c.update(gameTime));
        this.getComponent<AudioListener>(ComponentType.AudioListener)?.update();
    }
    public cloneForCollision(): GameObject {
        const ret = new GameObject('', <any>undefined);
        //ret.components = this.getComponents(ComponentType.Collider);
        //ret.components.forEach(c => (<any>c).gameObject = ret);
        //ret.rigidbody = this.rigidbody;
        return ret;
    }
    public destroy(): void {
        this.scene.destroyGameObject(this.name);
    }
}
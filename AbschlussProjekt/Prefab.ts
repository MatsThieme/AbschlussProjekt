import { AnimatedSprite } from './Components/AnimatedSprite.js';
import { Behaviour } from './Components/Behaviour.js';
import { CapsuleCollider } from './Components/CapsuleCollider.js';
import { CircleCollider } from './Components/CircleCollider.js';
import { ComponentType } from './Components/ComponentType.js';
import { ParticleSystem } from './Components/ParticleSystem.js';
import { RigidBody } from './Components/RigidBody.js';
import { Texture } from './Components/Texture.js';
import { TileMap } from './Components/TileMap.js';
import { Transform } from './Components/Transform.js';
import { GameObject } from './GameObject.js';
import { Scene } from './Scene.js';
import { Vector2 } from './Vector2.js';

new Vector2();

export class Prefab {
    public constructor() {

    }
    public static create(gameObject: GameObject): string {
        const scene = gameObject.scene;
        gameObject.scene = <any>undefined;
        gameObject.getComponents(ComponentType.Component).forEach(c => c.gameObject = <any>undefined);

        const ret = JSON.stringify(gameObject);
        gameObject.scene = scene;
        gameObject.getComponents(ComponentType.Component).forEach(c => c.gameObject = gameObject);
        return ret;
    }
    public static async load(path: string, scene: Scene): Promise<GameObject> {
        const result = await fetch('/Assets/' + path);
        const parsed = await result.json();

        const gO = new GameObject(parsed.name, scene);
        Object.assign(gO, parsed);
        console.log(gO);

        for (let component of gO.getComponents(ComponentType.Component)) {
            component.gameObject = gO;

            switch (component.type) {
                case ComponentType.AnimatedSprite: Object.setPrototypeOf(component, new AnimatedSprite(gO).constructor.prototype);
                case ComponentType.Behaviour: Object.setPrototypeOf(component, new (await import(('./Behaviours/' + (<Behaviour>component).name + 'js')))[(<Behaviour>component).name](gO).constructor.prototype);
                case ComponentType.BoxCollider: Object.setPrototypeOf(component, new AnimatedSprite(gO).constructor.prototype);
                case ComponentType.CapsuleCollider: Object.setPrototypeOf(component, new CapsuleCollider(gO).constructor.prototype);
                case ComponentType.CircleCollider: Object.setPrototypeOf(component, new CircleCollider(gO).constructor.prototype);
                case ComponentType.ParticleSystem: Object.setPrototypeOf(component, new ParticleSystem(gO).constructor.prototype);
                case ComponentType.RigidBody: Object.setPrototypeOf(component, new RigidBody(gO).constructor.prototype);
                case ComponentType.Texture: Object.setPrototypeOf(component, new Texture(gO).constructor.prototype);
                case ComponentType.TileMap: Object.setPrototypeOf(component, new TileMap(gO).constructor.prototype);
                case ComponentType.Transform: Object.setPrototypeOf(component, new Transform(gO).constructor.prototype);

                default: ;
            }

            //gO.transform = gO.getComponent(ComponentType.Transform);
            //gO.rigidbody = gO.getComponent(ComponentType.RigidBody);

            console.log(component);
        }

        return gO;
    }
}
import { BoxCollider } from '../Components/BoxCollider.js';
import { CapsuleCollider } from '../Components/CapsuleCollider.js';
import { CircleCollider } from '../Components/CircleCollider.js';
import { ComponentType } from '../Components/ComponentType.js';
import { GameObject } from '../GameObject.js';
import { Vector2 } from '../Vector2.js';
import { Physics } from './Physics.js';

addEventListener('message', (e: MessageEvent) => {
    if (!e.data) return postMessage(0);
    if (!e.isTrusted || e.data.name === 'close') return close();

    if (e.data && e.data.name === 'collision' && e.data.parameters?.length === 2) {
        const parameters: GameObject[] = e.data.parameters?.map(gO => Object.setPrototypeOf(gO, new GameObject('', <any>0))) || [];
        parameters.forEach(gO => {

            for (let collider of gO.getComponents(ComponentType.Collider)) {
                if (collider.type === ComponentType.BoxCollider) {
                    Object.setPrototypeOf(collider, new BoxCollider(<any>0));
                }
                else if (collider.type === ComponentType.CircleCollider) {
                    Object.setPrototypeOf(collider, new CircleCollider(<any>0));
                }
                else if (collider.type === ComponentType.CapsuleCollider) {
                    Object.setPrototypeOf(collider, new CapsuleCollider(<any>0));

                    Object.setPrototypeOf((<CapsuleCollider>collider).boxCollider, new BoxCollider(<any>0));
                    Object.setPrototypeOf((<CapsuleCollider>collider).circleColliderTop, new CircleCollider(<any>0));
                    Object.setPrototypeOf((<CapsuleCollider>collider).circleColliderBottom, new CircleCollider(<any>0));

                }
            }

            Object.setPrototypeOf(gO.transform.position, new Vector2());
        });

        return postMessage((<any>Physics.collision)(...parameters));
    }

    return postMessage(0);
});

declare interface MessageEvent extends Event {
    readonly data: {
        readonly name: string;
        readonly parameters?: any[];
    };
}

declare function postMessage(msg: any): void;
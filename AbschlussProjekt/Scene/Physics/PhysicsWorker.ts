import { CircleCollider } from '../GameObject/Components/CircleCollider.js';
import { Collider } from '../GameObject/Components/Collider.js';
import { ComponentType } from '../GameObject/Components/ComponentType.js';
import { GameObject } from '../GameObject/GameObject.js';
import { Vector2 } from '../Vector2.js';
import { Physics } from './Physics.js';

addEventListener('message', (e: MessageEvent) => {
    if (!e.data) return postMessage(0);
    if (!e.isTrusted || e.data.name === 'close') return close();

    if (e.data && e.data.name === 'collision' && e.data.parameters?.length === 2) {
        const parameters: GameObject[] = e.data.parameters?.map(gO => Object.setPrototypeOf(gO, new GameObject('', <any>0))) || [];
        parameters.forEach(gO => {

            for (let collider of gO.getComponents<Collider>(ComponentType.Collider)) {
                if (collider.type === ComponentType.CircleCollider) {
                    Object.setPrototypeOf(collider, new CircleCollider(<any>0));
                }
            }

            Object.setPrototypeOf(gO.transform.position, new Vector2());
        });

        return postMessage((<any>Physics.collision)(...parameters));
    }

    return postMessage(0);
});

/** @internal */
declare interface MessageEvent extends Event {
    readonly data: {
        readonly name: string;
        readonly parameters?: any[];
    };
}

/** @internal */
declare function postMessage(msg: any): void;
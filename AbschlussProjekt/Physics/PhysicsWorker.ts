import { Physics } from './Physics.js';

const physics = new Physics();

addEventListener('message', (e: MessageEvent) => {
    if (!e.isTrusted || e.data.name === 'close') return close();
    const result = (<any>Physics)[e.data.name](...(e.data.parameters || []));
    postMessage(result);
});

declare interface MessageEvent extends Event {
    readonly data: {
        readonly name: string;
        readonly parameters?: any[];
    };
}

declare function postMessage(msg: any): void;
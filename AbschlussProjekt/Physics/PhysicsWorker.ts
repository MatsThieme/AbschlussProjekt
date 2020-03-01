import { Physics } from './Physics.js';

addEventListener('message', e => {
    if (e.data === 'close') return close();
    postMessage((<any>Physics)[<string>e.data]());
});

declare function postMessage(msg: any): void;
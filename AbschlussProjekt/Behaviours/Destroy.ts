import { Behaviour } from '../Components/Behaviour.js';

export class Destroy extends Behaviour {
    start() {
        console.log('start');
        setTimeout(() => { console.log('destroy'); this.gameObject.destroy() }, 1000);
    }
}
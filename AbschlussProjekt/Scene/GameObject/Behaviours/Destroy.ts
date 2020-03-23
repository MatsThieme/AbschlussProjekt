import { Behaviour } from '../Components/Behaviour.js';

export class Destroy extends Behaviour {
    async start() {
        setTimeout(() => { this.gameObject.destroy() }, 50);
    }
}
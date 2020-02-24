import { GameObject } from './GameObject.js';
import { BoxCollider } from './Components/BoxCollider.js';

const test = new GameObject('test');
const boxCollider = test.addComponent(BoxCollider);

console.log(boxCollider.gameObject.transform.gameObject.name);

console.log(boxCollider.position);

process.stdin.resume();
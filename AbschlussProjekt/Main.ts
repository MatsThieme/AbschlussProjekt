import { Scene } from './Scene.js';
import { Vector2 } from './Vector2.js';

const scene = new Scene();

const go = scene.newGameObject('test');

document.body.appendChild(scene.domElement);

scene.cameraManager.addCamera(new Vector2(1920, 1080));

const v1 = new Vector2(0.5, 1);
const v2 = new Vector2(2, 2);

console.log(v1.angleBetween(new Vector2(0, 0), v2));
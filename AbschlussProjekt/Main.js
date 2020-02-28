import { Camera } from './Camera.js';
import { Scene } from './Scene.js';
import { Vector2 } from './Vector2.js';
const scene = new Scene();
const go = scene.newGameObject('test');
document.body.appendChild(scene.domElement);
scene.cameraManager.addCamera(new Camera(new Vector2(1920, 1080)));
console.log('');
process.stdin.resume();

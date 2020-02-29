import { Scene } from './Scene.js';
import { Vector2 } from './Vector2.js';
var scene = new Scene();
var go = scene.newGameObject('test');
document.body.appendChild(scene.domElement);
scene.cameraManager.addCamera(new Vector2(1920, 1080));
var v1 = new Vector2(0.5, 1);
var v2 = new Vector2(2, 2);
console.log(v1.radianBetween(new Vector2(0, 0), v2));

# SnowballEngine

2D Game-Engine written in TypeScript.


<b>Install</b>
```
npm i snowball-engine --save
```


<b>Setup</b>
In tsconfig.json add 
```JSON
"se": [ "./node_modules/snowball-engine/dist/Scene" ]
```
to paths.


<b>Usage</b>
```TypeScript
import { Scene, Camera } from 'se';
import { prefabCallback } from 'somewhere';

const scene = new Scene();

// add a camera
scene.addGameObject('camera', gameObject => {
  gameObject.addComponent(Camera, camera => {
    camera.resolution = new Vector2(1920, 1080);
    camera.size = new Vector2(16, 9);
  });
});


// add gameobjects
scene.addGameObject('example', prefabCallback);


document.body.appendChild(scene.domElement);

scene.start();
```

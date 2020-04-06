# SnowballEngine

2D Game-Engine written in TypeScript.



<b>Usage</b>
```TypeScript
const scene = new Scene();

// add a camera
scene.addGameObject('camera', gameObject => {
  gameObject.addComponent(Camera, camera => {
    camera.resolution = new Vector2(1920, 1080);
    camera.size = new Vector2(16, 9);
  });
});


// add gameobjects
scene.addGameObject('example', gameObject => {
  gameObject.addComponent(Texture, texture => {
    texture.sprite = new Sprite((context, canvas) => {
      ...
    });
  });
});


document.body.appendChild(scene.domElement);

scene.start();
```

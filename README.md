# SnowballEngine

2D Game-Engine written in TypeScript.



<b>Usage</b>
```TypeScript
const scene = new Scene();

// add a camera
await scene.newGameObject('camera', gameObject => {
    gameObject.addComponent(Camera, camera => {
        camera.resolution = new Vector2(1920, 1080);
        camera.size = new Vector2(16, 9);
    });
});


// add gameobjects
await scene.newGameObject('example', gameObject => {
    gameObject.addComponent(Texture, texture => {
        texture.sprite = new Sprite('img/someimage.png');
    });
});

// append canvas to dom
document.body.appendChild(scene.domElement);

await scene.start();
```

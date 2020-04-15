# SnowballEngine

2D Game-Engine written in TypeScript.



<b>Usage</b>
```TypeScript
const scene = new Scene();

// add a camera
await scene.newGameObject('camera', gameObject => {
    await gameObject.addComponent(Camera, camera => {
        camera.resolution = new Vector2(1920, 1080);
        camera.size = new Vector2(16, 9);
    });
});


// add gameobjects
await scene.newGameObject('example', gameObject => {
    await gameObject.addComponent(Texture, async texture => {
        texture.sprite = new Sprite('img/someimage.png');
        await texture.load!;
    });
});

// append canvas to dom
document.body.appendChild(scene.domElement);

await scene.start();
```

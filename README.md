### This repo won't be updated, you can find the current SnowballEngine here:
[Project Template](https://github.com/MatsThieme/SnowballEngineTemplate)
<br><br>

# SnowballEngine

2D Game-Engine written in TypeScript.

SnowballEngine is part of my final school project.

[dev branch](https://github.com/MatsThieme/SnowballEngine/tree/dev)
<br>
[Project Template](https://github.com/MatsThieme/SnowballEngineTemplate)

    
<b>Usage</b>
```TypeScript
const scene = new Scene();

// add a camera
await scene.newGameObject('camera', async gameObject => {
    await gameObject.addComponent(Camera, camera => {
        camera.resolution = new Vector2(1920, 1080);
        camera.size = new Vector2(16, 9);
    });
});


// add gameobjects
await scene.newGameObject('example', async gameObject => {
    await gameObject.addComponent(Texture, async texture => {
        texture.sprite = new Sprite('img/someimage.png');
        await texture.load!;
    });
});

// append canvas to dom
document.body.appendChild(scene.domElement);

await scene.start();
```

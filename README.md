# SnowballEngine

2D Game-Engine written in TypeScript.



<b>Usage</b>
```TypeScript
class Game {
    private readonly sceneManager: SceneManager;
    public constructor() {
        this.sceneManager = new SceneManager();
        this.initialize(this.sceneManager);
    }
    private async initialize(sceneManager: SceneManager): Promise<void> {

        // load assets
        await Assets.load('path/to/asset', AssetType.Image, 'some image');

        // create a scene
        const scene = sceneManager.create('Main Scene');

        // add gameobjects to scene
        await scene.addGameObject('something', gameObject => {
            // add components to scene
            gameObject.addComponent(Texture, texture => {
                texture.sprite = Assets.get('some image');
            });
        });

        await scene.start();
    }
}
```

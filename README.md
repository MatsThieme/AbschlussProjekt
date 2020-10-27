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
        // create a scene
        const loadingscreen = sceneManager.create('Loadingscreen');

        // add a camera
        loadingscreen.addGameObject('Camera', gameObject => {
            gameObject.addComponent(Camera, camera => {
                camera.resolution = Client.resolution;
                camera.size = Client.aspectRatio;
            });
        });
        
        // load scene
        sceneManager.load('Loadingscreen');
        
        
        // load assets
        await Assets.load('path/to/asset', AssetType.Image, 'some image');


        // create a scene
        const scene = sceneManager.create('Main Scene');

        // add gameobjects to scene
        scene.addGameObject('something', gameObject => {
            // add components to scene
            gameObject.addComponent(Texture, texture => {
                texture.sprite = Assets.get('some image');
            });
        });
        
        // add a camera
        scene.addGameObject('Camera', gameObject => {
            gameObject.addComponent(Camera, camera => {
                camera.resolution = Client.resolution;
                camera.size = Client.aspectRatio;
            });
        });
        
        
        // load scene
        sceneManager.load('Main Scene');
    }
}
```

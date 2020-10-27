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

        // show something to the waiting user
        loadingscreen.ui.addMenu('Loadingscreen', menu => {
            menu.addUIElement(UIText, text => {
                text.localAlignH = AlignH.Center;
                text.localAlignV = AlignV.Center;
                text.alignH = AlignH.Center;
                text.alignV = AlignV.Center;

                console.log('hi')

                let counter = 0;
                setInterval(() => text.label = 'loading' + '.'.repeat(counter = ++counter % 4), 500);


                text.fontSize = UIFontSize.Large;

                text.padding = new Vector2(1, 1);
            });

            menu.active = true;
        });

        // add timeout to show loadingscreen
        await asyncTimeout(1000);


        // load scene
        sceneManager.load('Loadingscreen');


        // // load asset
        // await Assets.load('path/to/asset', AssetType.Image, 'some image');

        // create asset
        Assets.set(createSprite((ctx, c) => {
            ctx.fillStyle = Color.yellow.colorString;
            ctx.fillRect(0, 0, c.width, c.height);
        }), 'some image');

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

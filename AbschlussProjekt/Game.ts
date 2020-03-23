import { FontLoader } from './FontLoader.js';
import { asyncTimeout } from './Helpers.js';
import { Move } from './Scene/GameObject/Behaviours/Move.js';
import { CircleCollider } from './Scene/GameObject/Components/CircleCollider.js';
import { CircleRenderer } from './Scene/GameObject/Components/CircleRenderer.js';
import { FloorPrefab } from './Scene/Prefabs/GameObjects/FloorPrefab.js';
import { LeftPrefab } from './Scene/Prefabs/GameObjects/LeftPrefab.js';
import { PlayerPrefab } from './Scene/Prefabs/GameObjects/PlayerPrefab.js';
import { RightPrefab } from './Scene/Prefabs/GameObjects/RightPrefab.js';
import { TopPrefab } from './Scene/Prefabs/GameObjects/TopPrefab.js';
import { xAxisprefab } from './Scene/Prefabs/GameObjects/xAxisPrefab.js';
import { yAxisprefab } from './Scene/Prefabs/GameObjects/yAxisPrefab.js';
import { LoadingScreenPrefab } from './Scene/Prefabs/LoadingScreenPrefab.js';
import { DebugOverlayPrefab } from './Scene/Prefabs/UI/DebugOverlayPrefab.js';
import { MainMenuPrefab } from './Scene/Prefabs/UI/MainMenu/MainMenuPrefab.js';
import { Scene } from './Scene/Scene.js';
import { Settings } from './Scene/Settings.js';
import { Vector2 } from './Scene/Vector2.js';
import { Line } from './Scene/Line.js';

class Game {
    private scene: Scene;
    public constructor() {
        this.scene = new Scene();

        (<any>window).scene = this.scene;


        this.initialize(this.scene).then(() => this.scene.start());
    }
    private async initialize(scene: Scene): Promise<void> {
        document.body.appendChild(scene.domElement);
        scene.domElement.width = 1920;
        scene.domElement.height = 1080;

        scene.loadingScreen = LoadingScreenPrefab;

        await FontLoader.load('/Font/JosefinSlab-Regular.ttf', Settings.mainFont);

        scene.newCamera('camera', camera => {
            camera.resolution = new Vector2(1920, 1080);
            camera.size = new Vector2(16, 9);
        });


        //scene.newGameObject('Polygon', PolygonPrefab);

        for (let i = -3; i < 2; i++)
            for (let j = -2; j <= 2; j++)
                scene.newGameObject('Circle', gameObject => {
                    gameObject.addComponent(CircleCollider, circleCollider => {
                        circleCollider.radius = 0.5;
                    });

                    gameObject.transform.relativePosition = new Vector2(j, i + 1);
                    gameObject.rigidbody.useAutoMass = true;
                    gameObject.addComponent(CircleRenderer);
                });

        scene.newGameObject('Circle', gameObject => {
            gameObject.addComponent(CircleCollider, circleCollider => {
                circleCollider.radius = 0.5;
            });

            gameObject.transform.relativePosition = new Vector2(0, -3.5);
            gameObject.rigidbody.useAutoMass = true;
            gameObject.addComponent(CircleRenderer);
            gameObject.addComponent(Move);
        });

        // movable polygon
        //scene.newGameObject('Player', PlayerPrefab);


        // display x and y axis
        scene.newGameObject('xAxis', xAxisprefab);
        scene.newGameObject('yAxis', yAxisprefab);

        // bounds
        scene.newGameObject('left', LeftPrefab);
        scene.newGameObject('right', RightPrefab);
        scene.newGameObject('top', TopPrefab);
        scene.newGameObject('floor', FloorPrefab);

        scene.ui.addMenu('Main Menu', MainMenuPrefab);
        scene.ui.addMenu('debug overlay', DebugOverlayPrefab);



        await asyncTimeout(100);
    }
}

if (!window.OffscreenCanvas) (<any>window.OffscreenCanvas) = function (width: number, height: number) { const canvas = document.createElement('canvas'); canvas.width = width, canvas.height = height; return canvas; } // polyfill OffscreenCanvas

new Game();

//to fix:
// game freezes in worker collision detection circle vs circle and circle vs polygon 
// collision response impulse strength over dist
// menu aabb and clicks

// to do:
// use child object collider in collision calculations
// frame align
// canvas rotation in camera component


// to test:
// child collider
// circle collisions


// optional optimisations:
// replace line intersection with face clipping in collisionPolygon
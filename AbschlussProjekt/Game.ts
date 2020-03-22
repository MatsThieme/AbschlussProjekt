import { FontLoader } from './FontLoader.js';
import { asyncTimeout } from './Helpers.js';
import { FloorPrefab } from './Scene/Prefabs/GameObjects/FloorPrefab.js';
import { LeftPrefab } from './Scene/Prefabs/GameObjects/LeftPrefab.js';
import { PlayerPrefab } from './Scene/Prefabs/GameObjects/PlayerPrefab.js';
import { PolygonPrefab } from './Scene/Prefabs/GameObjects/PolygonPrefab.js';
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


        scene.newGameObject('Polygon', PolygonPrefab);

        // movable polygon
        scene.newGameObject('Player', PlayerPrefab);


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
// polygon collision (normal direction)
// collision response rotation
// polygon circle collision, circle circle collision

// to do:
// friction
// simplify polygon collision detection, function collision(vertices1: { x: number, y: number }[], vertices2: { x: number, y: number }[]): {contacts, collisionNormal...}
// use child object collider in collision calculations
// frame align
// canvas rotation in camera component


// to test:
// child collider
// circle collisions
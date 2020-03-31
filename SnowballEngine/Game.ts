import { FontLoader } from './Scene/FontLoader.js';
import { LoadingScreenPrefab } from './Scene/Prefabs/LoadingScreenPrefab.js';
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

        await FontLoader.load('Font/JosefinSlab-Regular.ttf', Settings.mainFont);

        scene.newCamera('camera', camera => {
            camera.resolution = new Vector2(1920, 1080);
            camera.size = new Vector2(16, 9);
        });



    }
}

new Game();

//to fix:
// collision response impulse weaker over larger radius
// menu aabb and clicks
// child collider

// to test:
// tilemap circle polygon collision

// to do:
// canvas rotation in camera component
// TilemapCollisions find contact points

// optional optimisations:
// polygon intersection: support points
// replace line intersection with face clipping in collisionPolygon

// optional features:
// continuous collision
// joints
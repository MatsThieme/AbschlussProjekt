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
import { PolygonCollider } from './Scene/GameObject/Components/PolygonCollider.js';
import { PolygonRenderer } from './Scene/GameObject/Components/PolygonRenderer.js';
import { PolygonPrefab } from './Scene/Prefabs/GameObjects/PolygonPrefab.js';
import { Component } from './Scene/GameObject/Components/Component.js';
import { ComponentType } from './Scene/GameObject/Components/ComponentType.js';
import { Physics } from './Scene/Physics/Physics.js';
import { GameObject } from './Scene/GameObject/GameObject.js';
import { PhysicsMaterial } from './Scene/Physics/PhysicsMaterial.js';

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

        //const width = 1;
        //const height = 1;

        //for (let i = Math.round(-width / 2); i < Math.round(width / 2); i++)
        //    for (let j = Math.round(-height / 2); j < Math.round(height / 2); j++)
        //        scene.newGameObject('Circle', gameObject => {
        //            gameObject.addComponent(CircleCollider, circleCollider => {
        //                circleCollider.radius = 0.5;
        //            });

        //            gameObject.transform.relativePosition = new Vector2(i / 4, (j + 1) / 4);
        //            gameObject.rigidbody.useAutoMass = true;
        //            gameObject.addComponent(CircleRenderer);
        //        });



        //scene.newGameObject('Circle', gameObject => {
        //    gameObject.addComponent(CircleCollider, circleCollider => {
        //        circleCollider.radius = 0.5;
        //    });

        //    gameObject.transform.relativePosition = new Vector2(-3.5, -3.5);
        //    gameObject.rigidbody.useAutoMass = true;
        //    gameObject.addComponent(CircleRenderer);
        //    gameObject.addComponent(Move);
        //});

        //scene.newGameObject('Poly', gameObject => {
        //    gameObject.addComponent(PolygonCollider);

        //    gameObject.transform.relativePosition = new Vector2(0, -3.5);
        //    gameObject.rigidbody.useAutoMass = true;
        //    gameObject.addComponent(PolygonRenderer);
        //});




        //const x = scene.newGameObject('Player', PlayerPrefab, gO => {
        //    gO.transform.relativePosition.x = 0.5;
        //});
        //x.rigidbody.destroy();
        //x.parent = 
        scene.newGameObject('Player', PlayerPrefab);

        scene.newGameObject('Polygon', PolygonPrefab);


        // display x and y axis
        scene.newGameObject('xAxis', xAxisprefab);
        scene.newGameObject('yAxis', yAxisprefab);

        // bounds
        //scene.newGameObject('left', LeftPrefab);
        //scene.newGameObject('right', RightPrefab);
        //scene.newGameObject('top', TopPrefab);
        scene.newGameObject('floor', FloorPrefab);

        scene.ui.addMenu('Main Menu', MainMenuPrefab);
        scene.ui.addMenu('debug overlay', DebugOverlayPrefab);


        //await asyncTimeout(100);
    }
}

new Game();

//to fix:
// collision response impulse strength over dist
// menu aabb and clicks
// child collider


// to do:
// frame align
// canvas rotation in camera component


// optional optimisations:
// replace line intersection with face clipping in collisionPolygon
// continuous collision
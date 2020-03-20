import { FontLoader } from './FontLoader.js';
import { asyncTimeout } from './Helpers.js';
import { AlignH, AlignV } from './Scene/GameObject/Align.js';
import { Move } from './Scene/GameObject/Behaviours/Move.js';
import { ReloadPage } from './Scene/GameObject/Behaviours/ReloadPage.js';
import { PolygonCollider } from './Scene/GameObject/Components/PolygonCollider.js';
import { PolygonRenderer } from './Scene/GameObject/Components/PolygonRenderer.js';
import { Texture } from './Scene/GameObject/Components/Texture.js';
import { AABB } from './Scene/Physics/AABB.js';
import { PhysicsMaterial } from './Scene/Physics/PhysicsMaterial.js';
import { Scene } from './Scene/Scene.js';
import { Sprite } from './Scene/Sprite.js';
import { UIButton } from './Scene/UI/UIElements/UIButton.js';
import { UIDropdown } from './Scene/UI/UIElements/UIDropdown.js';
import { UIText } from './Scene/UI/UIElements/UIText.js';
import { UIFontSize } from './Scene/UI/UIFontSize.js';
import { Vector2 } from './Scene/Vector2.js';

class Game {
    private scene: Scene;
    public constructor() {
        this.scene = new Scene();

        (<any>window).scene = this.scene;

        this.createLoadingScreen(this.scene);

        this.initialize(this.scene).then(() => this.scene.start());
    }
    private async initialize(scene: Scene): Promise<void> {
        document.body.appendChild(scene.domElement);
        scene.domElement.width = 1920;
        scene.domElement.height = 1080;

        await FontLoader.load('/Assets/Font/JosefinSlab-Regular.ttf', 'MainFont');

        scene.newCamera('camera', camera => {
            camera.resolution = new Vector2(innerWidth, innerHeight);
            camera.size = new Vector2(16, 9);
        });


        scene.newGameObject('polygon', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(-2, 0.2), new Vector2(1.5, 1), new Vector2(1, 1.1), new Vector2(0.5, 1), new Vector2(1, 0)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(0, 2);
            gameObject.rigidbody.useAutoMass = true;
            gameObject.addComponent(PolygonRenderer);
        });

        scene.newGameObject('polygon', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1), new Vector2(1, 0)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(0, 0);
            gameObject.rigidbody.useAutoMass = true;
            gameObject.addComponent(PolygonRenderer);
            gameObject.addComponent(Move);
            gameObject.addComponent(ReloadPage);
        });

        //scene.newGameObject('circle', gameObject => {
        //    gameObject.addComponent(CircleCollider, circleCollider => {
        //        circleCollider.material = new PhysicsMaterial(0, 1, 1);
        //    });

        //    gameObject.transform.relativePosition = new Vector2(0, -2);
        //    gameObject.rigidbody.useAutoMass = true;
        //    gameObject.addComponent(Move);
        //    gameObject.addComponent(CircleRenderer);
        //});



        scene.newGameObject('xAxis', gameObject => {
            gameObject.addComponent(Texture, texture => {
                texture.sprite = new Sprite('spriteTest1.png');
            });

            gameObject.transform.relativeScale = new Vector2(100, 0.01);
            gameObject.drawPriority = -1;
        });

        scene.newGameObject('yAxis', gameObject => {
            gameObject.addComponent(Texture, texture => {
                texture.sprite = new Sprite('spriteTest1.png');
            });

            gameObject.transform.relativeScale = new Vector2(0.01, 100);
            gameObject.drawPriority = -1;
        });



        scene.newGameObject('left', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 0), new Vector2(0, 1)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(-8, 0);
            gameObject.transform.relativeScale = new Vector2(0.5, 100);
            gameObject.addComponent(PolygonRenderer);
        });

        scene.newGameObject('right', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 0), new Vector2(0, 1)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(8, 0);
            gameObject.transform.relativeScale = new Vector2(0.5, 100);
            gameObject.addComponent(PolygonRenderer);
        });

        scene.newGameObject('top', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 0), new Vector2(0, 1)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(0, 4.5);
            gameObject.transform.relativeScale = new Vector2(100, 0.5);
            gameObject.addComponent(PolygonRenderer);
        });

        scene.newGameObject('floor', gameObject => {
            gameObject.addComponent(PolygonCollider, polygonCollider => {
                polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 0), new Vector2(0, 1)];
                polygonCollider.material = new PhysicsMaterial(0, 1, 1);
            });

            gameObject.transform.relativePosition = new Vector2(0, -4.5);
            gameObject.transform.relativeScale = new Vector2(100, 0.5);
            gameObject.addComponent(PolygonRenderer);
        });


        scene.ui.addMenu('test', menu => {
            menu.aabb = new AABB(new Vector2(1920, 1080), new Vector2());
            menu.active = true;
            menu.addUIElement(UIButton, button => {
                button.aabb = new AABB(new Vector2(200, 120), new Vector2());
                button.localAlignH = AlignH.Center;
                button.localAlignV = AlignV.Center;
                button.alignH = AlignH.Center;
                button.alignV = AlignV.Center;
                button.cbOnInput = b => { menu.active = !menu.active; };
                button.label = 'play';
                button.fontSize = UIFontSize.Large;
            });

            //menu.addUIElement(UICheckbox, checkbox => {
            //    checkbox.label = 'check';
            //    checkbox.cbOnInput = c => console.log(c.checked);
            //    checkbox.aabb = new AABB(new Vector2(50, 50), new Vector2(200, 200));
            //});

            menu.addUIElement(UIDropdown, dropdown => {
                dropdown.aabb = new AABB(new Vector2(150, 200), new Vector2(200, 350));
                dropdown.values = ['first', 'second', 'third'];
                dropdown.cbOnInput = d => console.log(d.value);
                dropdown.fitText(1.2);
            });

            menu.addUIElement(UIDropdown, dropdown => {
                dropdown.aabb = new AABB(new Vector2(150, 200), new Vector2(370, 350));
                dropdown.values = ['first', 'second', 'third'];
                dropdown.cbOnInput = d => console.log(d.value);
            });
        });

        scene.ui.addMenu('debug overlay', menu => {
            menu.aabb = new AABB(new Vector2(1920, 1080), new Vector2());
            menu.active = true;
            menu.pauseScene = false;
            menu.addUIElement(UIText, text => {
                text.aabb = new AABB(new Vector2(100, 50), new Vector2(0, 0));
                text.fontSize = UIFontSize.Small;
                setInterval(() => text.label = this.scene.framedata.fps.toString(), 500);
            });
        });

        //console.log(this.scene.find('polygon'));
        
        await asyncTimeout(500);
    }
    private createLoadingScreen(scene: Scene): void {
        let counter = 0;

        scene.loadingScreen = (context, canvas) => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.font = `${canvas.width / 100}px arial`;
            context.fillText(`Loading${'.'.repeat(~~(counter++ / 5) % 4)}`, canvas.width / 2, canvas.height / 2);
        };
    }
}

if (!window.OffscreenCanvas) (<any>window.OffscreenCanvas) = function (width: number, height: number) { const canvas = document.createElement('canvas'); canvas.width = width, canvas.height = height; return canvas; } // polyfill OffscreenCanvas

new Game();

//to fix:
// polygon collision (normal direction)
// particlesystem align
// camera aspect ratio
// polygon circle collision, circle circle collision

// to do:
// friction
// simplify polygon collision detection, function collision(vertices1: Vector[], vertices2: Vector2[]): {contacts, collisionNormal...}
// ui
// no rigidbody in child objects
// use child object collider in collision calculations
// frame align
// canvas rotation in camera component
// stroke option for ui elements
// ui color options
// mainfont variable in settings
// ggf change static class Settings to class Settings, 1 instance per scene
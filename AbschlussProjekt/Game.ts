import { AnimatedSprite } from './Components/AnimatedSprite.js';
import { AudioListener } from './Components/AudioListener.js';
import { AudioSource } from './Components/AudioSource.js';
import { BoxCollider } from './Components/BoxCollider.js';
import { Camera } from './Components/Camera.js';
import { Texture } from './Components/Texture.js';
import { Physics } from './Physics/Physics.js';
import { FileDownload } from './Resources/FileDownload.js';
import { Sprite } from './Resources/Sprite.js';
import { Scene } from './Scene.js';
import { SpriteAnimation } from './SpriteAnimation.js';
import { AsyncWorker } from './Worker/AsyncWorker.js';

class Game {
    public scene: Scene;
    public constructor() {
        this.scene = new Scene();
        document.body.appendChild(this.scene.domElement);
        this.scene.domElement.width = 1920;
        this.scene.domElement.height = 1080;

        const camera = this.scene.newCamera('cam');
        camera.getComponent(Camera);

        // gO1
        const gO1 = this.scene.newGameObject('colliderTest1');
        const box1 = gO1.addComponent(BoxCollider);
        gO1.rigidbody.mass = 1;
        gO1.transform.position.y = -2;

        const animatedSprite = gO1.addComponent(AnimatedSprite);
        animatedSprite.spriteAnimations = [new SpriteAnimation([new Sprite(new FileDownload('spriteTest1.png')), new Sprite(new FileDownload('spriteTest2.png'))], 500)];

        gO1.addComponent(AudioListener);


        // ground
        const ground = this.scene.newGameObject('ground');
        ground.transform.scale.x = 10;
        const groundCollider = ground.addComponent(BoxCollider);

        const groundTexture = ground.addComponent(Texture);
        groundTexture.sprite = new Sprite(new FileDownload('spriteTest1.png'));



        // audio source test
        const gO2 = this.scene.newGameObject('audio source');
        const source1 = gO2.addComponent(AudioSource);
        source1.clip = 'audiotest.mp3';
        source1.loop = true;
        source1.play();
        source1.volume = 1;
    }
}

new Game();






AsyncWorker

Physics



















































//AsyncWorker.work('Physics/PhysicsWorker.js', { name: 'testW' }).then(console.log).catch(console.log);
//const collider = gO.addComponent(CircleCollider);
//console.log(collider.recalculateDirection(contact, incoming).toString());



        //for (let i = 0; i < 100; i++) gO1.addComponent(CapsuleCollider);
        //for (let i = 0; i < 100; i++) gO1.addComponent(BoxCollider);
        //for (let i = 0; i < 100; i++) gO1.addComponent(CircleCollider);

        //gO1.transform.position = new Vector2(1, 1);
        //gO2.transform.position = new Vector2(1.4, 2.5);
        //gO3.transform.position = new Vector2(4, 1);

        //box1.size = new Vector2(1, 2);
        //box2.size = new Vector2(1.5, 2.5);
        //box3.size = new Vector2(1, 1);


        //Physics.asyncCollision(gO1, gO2).then(console.log).catch(console.log);

        //const x = 1000;

        //console.time('collision');
        //for (let i = 0; i < x; i++) {
        //    Physics.collision(gO1, gO2);
        //}
        //console.timeEnd('collision');

        //(async () => {
        //    console.time('warmup');
        //    await AsyncWorker.createWorker('Physics/PhysicsWorker.js', navigator.hardwareConcurrency || 12);
        //    console.timeEnd('warmup');

        //    const start = performance.now();

        //    for (let i = 0; i < x; i++) {
        //        let y = Physics.asyncCollision(gO1, gO2);
        //        if (i === x - 1) {
        //            await y;
        //            console.log('asyncCollision: ' + (performance.now() - start));
        //        }
        //    }

        //    setTimeout(() => {

        //        //console.time('sgfr');
        //        //Physics.asyncCollision(gO1, gO2).then(() => console.timeEnd('sgfr'));
        //    }, 1000);

        //})();


        //const c1 = gO1.addComponent(CircleCollider);
        //const c2 = gO2.addComponent(CircleCollider);
        //const c3 = gO3.addComponent(CircleCollider);


        //gO1.transform.position = new Vector2(3, 3);
        //gO2.transform.position = new Vector2(4, 4);
        //gO3.transform.position = new Vector2(1, 2);

        //c1.radius = 1;
        //c2.radius = 1;
        //c3.radius = 0.5;


        //console.log(Physics.CollisionCircle(c1, c2));
        //console.log(Physics.CollisionCircle(c2, c3));
        //console.log(Physics.CollisionCircle(c3, c1));

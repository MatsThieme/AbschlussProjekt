import { Angle } from '../Angle.js';
import { Behaviour } from '../Components/Behaviour.js';
import { GameTime } from '../GameTime.js';
import { Collision } from '../Physics/Collision.js';
import { Vector2 } from '../Vector2.js';

export class TestBehaviour extends Behaviour {
    private speed: number = 0.1;
    private angle: Angle = new Angle(0, 0);
    private point: Vector2 = new Vector2(0, 0);
    private radius: number = 2;
    private time: number = 0;

    protected start(): void {

    }

    public update(gameTime: GameTime): void {
        this.angle.degree += gameTime.deltaTime * this.speed;
        this.gameObject.transform.relativePosition = new Vector2(Math.cos(this.angle.radian) * this.radius, Math.sin(this.angle.radian) * this.radius);
        this.gameObject.transform.rotation = new Angle(undefined, this.gameObject.transform.rotation.degree + gameTime.deltaTime / 10);

        this.time += gameTime.deltaTime * 0.001;
        this.gameObject.transform.relativeScale.x = Math.sin(this.time);
        this.gameObject.transform.relativeScale.y = Math.sin(this.time);

        //this.gameObject.transform.relativePosition.x += this.input.getAxis(InputType.MoveHorizontal).value * gameTime.deltaTime / 1000;
        //this.gameObject.transform.relativePosition.y += this.input.getAxis(InputType.MoveVertical).value * gameTime.deltaTime / 1000;
    }

    public onCollision(collisions: Collision[]) {

    }
}
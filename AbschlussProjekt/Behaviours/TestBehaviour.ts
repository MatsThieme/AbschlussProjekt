import { Behaviour } from '../Components/Behaviour.js';
import { GameTime } from '../GameTime.js';
import { Vector2 } from '../Vector2.js';
import { Angle } from '../Angle.js';

export class TestBehaviour extends Behaviour {
    speed: number = 0.1;
    angle: Angle = new Angle(0, 0);
    point: Vector2 = new Vector2(0, 0);
    radius: number = 2;
    start(): void {

    }
    update(gameTime: GameTime): void {
        this.angle.degree += gameTime.deltaTime * this.speed;
        this.gameObject.transform.relativePosition = new Vector2(Math.cos(this.angle.radian) * this.radius, Math.sin(this.angle.radian) * this.radius);
        this.gameObject.transform.rotation = new Angle(undefined, this.gameObject.transform.rotation.degree + gameTime.deltaTime / 10);
    }
}
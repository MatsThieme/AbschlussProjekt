import { Angle } from '../../Angle.js';
import { GameTime } from '../../GameTime.js';
import { Collision } from '../../Physics/Collision.js';
import { Behaviour } from '../Components/Behaviour.js';

export class TestBehaviour extends Behaviour {
    speed!: number;
    angle!: Angle;
    time!: number;

    awake(): void {
        this.speed = 0.0001;
        this.angle = new Angle();
        this.time = 0;
    }

    async start(): Promise<void> {

    }

    async update(gameTime: GameTime): Promise<void> {
        this.angle.degree += gameTime.deltaTime * this.speed;
        this.gameObject.transform.relativeRotation = new Angle(undefined, this.gameObject.transform.rotation.degree + gameTime.deltaTime / 10);

        this.time += gameTime.deltaTime * this.speed;
        this.gameObject.transform.relativeScale.x = Math.sin(this.time);
        this.gameObject.transform.relativeScale.y = Math.sin(this.time);
    }

    onCollision(collisions: Collision[]): void {

    }
}
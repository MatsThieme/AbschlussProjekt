import { Behaviour } from '../Components/Behaviour.js';
import { GameTime } from '../GameTime.js';
import { InputType } from '../Input/InputType.js';
import { Vector2 } from '../Vector2.js';

export class Move extends Behaviour {
    async update(gameTime: GameTime): Promise<void> {
        this.gameObject.rigidbody.force.add(new Vector2(this.input.getAxis(InputType.MoveHorizontal).value / 1000, this.input.getAxis(InputType.MoveVertical).value * gameTime.deltaTime / 10000));
        this.gameObject.rigidbody.torque += this.input.getAxis(InputType.Rotate).value / 1000;

        if (this.input.getButton(InputType.Trigger).down && !this.input.getButton(InputType.Trigger).clicked) this.gameObject.rigidbody.applyImpulse(new Vector2(0, 0.1), new Vector2(0, 0));
    }
}
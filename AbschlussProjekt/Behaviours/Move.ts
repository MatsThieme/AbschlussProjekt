import { Behaviour } from '../Components/Behaviour.js';
import { GameTime } from '../GameTime.js';
import { InputType } from '../Input/InputType.js';

export class Move extends Behaviour {
    update(gameTime: GameTime): void {
        this.gameObject.transform.relativePosition.x += this.input.getAxis(InputType.MoveHorizontal).value * gameTime.deltaTime / 100;
        this.gameObject.transform.relativePosition.y += this.input.getAxis(InputType.MoveVertical).value * gameTime.deltaTime / 100;

        this.gameObject.transform.relativeRotation.radian += this.input.getAxis(InputType.Rotate).value * gameTime.deltaTime / 100;
    }
}
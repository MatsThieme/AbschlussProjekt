import { Behaviour } from '../Components/Behaviour.js';
import { GameTime } from '../GameTime.js';
import { InputType } from '../Input/InputType.js';

export class InputTest extends Behaviour {
    async update(gameTime: GameTime): Promise<void> {
        if (this.input.getButton(InputType.Interact).down && !this.input.getButton(InputType.Interact).clicked) console.log('InputType.Interact: down, not clicked');
        if (this.input.getButton(InputType.Trigger).down && !this.input.getButton(InputType.Trigger).clicked) console.log('InputType.Trigger: down, not clicked');
    }
}
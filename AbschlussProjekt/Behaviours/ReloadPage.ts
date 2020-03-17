import { Behaviour } from '../Components/Behaviour.js';
import { GameTime } from '../GameTime.js';
import { InputType } from '../Input/InputType.js';
import { Vector2 } from '../Vector2.js';
import { AABB } from '../Physics/AABB.js';

export class ReloadPage extends Behaviour {
    async update(gameTime: GameTime): Promise<void> {
        if (!this.gameObject.scene.cameraManager.mainCamera.AABBInCamera(new AABB(new Vector2(), this.gameObject.transform.position))) location.reload();
    }
}
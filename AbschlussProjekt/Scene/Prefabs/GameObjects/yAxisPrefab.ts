import { Texture } from '../../GameObject/Components/Texture.js';
import { GameObject } from '../../GameObject/GameObject.js';
import { Sprite } from '../../Sprite.js';
import { Vector2 } from '../../Vector2.js';

export function yAxisprefab(gameObject: GameObject) {
    gameObject.addComponent(Texture, texture => {
        texture.sprite = new Sprite('spriteTest1.png');
    });

    gameObject.transform.relativeScale = new Vector2(0.01, 100);
    gameObject.drawPriority = -1;
}
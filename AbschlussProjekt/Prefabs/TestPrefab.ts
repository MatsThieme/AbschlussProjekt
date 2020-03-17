import { ParticleSystem } from '../Components/ParticleSystem.js';
import { GameObject } from '../GameObject.js';
import { Sprite } from '../Sprite.js';

export function TestPrefab(gameObject: GameObject) {
    gameObject.addComponent(ParticleSystem, particleSystem => {
        particleSystem.sprites.push(new Sprite('spriteTest1.png'));
    });
}
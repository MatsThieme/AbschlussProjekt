import { GameObject } from '../GameObject.js';
import { Vector2 } from '../Vector2.js';

export class Collision {
    public readonly gameObjectA: GameObject;
    public readonly gameObjectB: GameObject;
    public readonly normal: Vector2 | undefined;
    public readonly penetration: number;
    public constructor(gameObjectA: GameObject, gameObjectB: GameObject, normal?: Vector2, penetration: number = 0) {
        this.gameObjectA = gameObjectA;
        this.gameObjectB = gameObjectB;
        this.normal = normal;
        this.penetration = penetration;
    }
}
import { GameObject } from '../GameObject.js';
import { Vector2 } from '../Vector2.js';

export class Collision {
    public readonly gameObjectA: GameObject;
    public readonly gameObjectB: GameObject;
    public readonly contactPoints: Vector2[];
    public readonly colliding: boolean;
    public constructor(gameObjectA: GameObject, gameObjectB: GameObject, contactPoints: Vector2[] = [], colliding: boolean = false) {
        this.gameObjectA = gameObjectA;
        this.gameObjectB = gameObjectB;
        this.contactPoints = contactPoints;
        this.colliding = colliding;
    }
}
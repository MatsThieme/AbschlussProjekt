export class Collision {
    constructor(gameObjectA, gameObjectB, contactPoints = [], colliding = false) {
        this.gameObjectA = gameObjectA;
        this.gameObjectB = gameObjectB;
        this.contactPoints = contactPoints;
        this.colliding = colliding;
    }
}

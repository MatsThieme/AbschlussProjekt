"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Collision {
    constructor(gameObjectA, gameObjectB, contactPoints = [], colliding = false) {
        this.gameObjectA = gameObjectA;
        this.gameObjectB = gameObjectB;
        this.contactPoints = contactPoints;
        this.colliding = colliding;
    }
}
exports.Collision = Collision;
//# sourceMappingURL=Collision.js.map
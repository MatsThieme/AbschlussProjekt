var Collision = /** @class */ (function () {
    function Collision(gameObjectA, gameObjectB, contactPoints, colliding) {
        if (contactPoints === void 0) { contactPoints = []; }
        if (colliding === void 0) { colliding = false; }
        this.gameObjectA = gameObjectA;
        this.gameObjectB = gameObjectB;
        this.contactPoints = contactPoints;
        this.colliding = colliding;
    }
    return Collision;
}());
export { Collision };

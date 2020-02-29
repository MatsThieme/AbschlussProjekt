var GameTime = /** @class */ (function () {
    function GameTime() {
        this._lastTime = this.now;
        this._deltaTime = 0;
    }
    Object.defineProperty(GameTime.prototype, "deltaTime", {
        get: function () {
            return this._deltaTime;
        },
        enumerable: true,
        configurable: true
    });
    GameTime.prototype.update = function () {
        if (this._lastTime)
            this._deltaTime = this.now - this._lastTime;
        this._lastTime = this.now;
    };
    Object.defineProperty(GameTime.prototype, "now", {
        get: function () {
            return Date.now();
        },
        enumerable: true,
        configurable: true
    });
    return GameTime;
}());
export { GameTime };

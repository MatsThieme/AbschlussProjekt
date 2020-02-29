var Sprite = /** @class */ (function () {
    function Sprite(file) {
        var _this = this;
        this.loaded = false;
        this.file = file;
        this.image = new Image();
        this.image.onload = function () { return _this.loaded = true; };
        this.image.src = file.dataURL;
    }
    return Sprite;
}());
export { Sprite };

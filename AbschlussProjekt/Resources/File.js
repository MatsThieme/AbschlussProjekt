var File = /** @class */ (function () {
    function File(name) {
        var _this = this;
        this._loaded = false;
        this._url = '';
        this.name = name;
        var cached = File.cache.get(name);
        if (cached) {
            this._loaded = cached.loaded;
            this._data = cached.data;
            this._url = cached.dataURL;
        }
        else {
            File.cache.set(name, this);
            fetch(name)
                .then(function (x) { return x.blob(); })
                .then(function (x) {
                _this._data = x;
                _this._url = URL.createObjectURL(x);
                _this._loaded = true;
            });
        }
    }
    Object.defineProperty(File.prototype, "loaded", {
        get: function () {
            return this._loaded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "dataURL", {
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    File.cache = new Map();
    return File;
}());
export { File };

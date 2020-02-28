export class File {
    constructor(name) {
        this._loaded = false;
        this._url = '';
        this.name = name;
        if (File.cache.get(name)) {
            Object.assign(this, File.cache.get(name));
        }
        else {
            File.cache.set(name, this);
            fetch(name)
                .then(x => x.blob())
                .then(x => {
                this._data = x;
                this._url = URL.createObjectURL(x);
                this._loaded = true;
            });
        }
    }
    get loaded() {
        return this._loaded;
    }
    get data() {
        return this._data;
    }
    get dataURL() {
        return this._url;
    }
}
File.cache = new Map();

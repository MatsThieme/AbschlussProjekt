export class File {
    constructor(name) {
        this._loaded = false;
        this._url = '';
        this.name = name;
        const cached = File.cache.get(name);
        if (cached) {
            this._loaded = cached.loaded;
            this._data = cached.data;
            this._url = cached.dataURL;
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

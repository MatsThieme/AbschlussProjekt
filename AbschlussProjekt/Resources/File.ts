export class File {
    private static cache: Map<string, File> = new Map();
    private _loaded: boolean = false;
    private _data: Blob | undefined;
    private _url: string = '';
    public name: string;
    public constructor(name: string) {
        this.name = name;

        const cached = File.cache.get(name);
        if (cached) {
            this._loaded = cached.loaded;
            this._data = cached.data;
            this._url = cached.dataURL;
        } else {
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
    public get loaded(): boolean {
        return this._loaded;
    }
    public get data(): Blob | undefined {
        return this._data;
    }
    public get dataURL(): string {
        return this._url;
    }
}
export class FileDownload {
    private static cache: Map<string, FileDownload> = new Map();
    private _loaded: boolean = false;
    private _data: Blob | undefined;
    private _dataUrl: string = '';
    public name: string;
    public onload: () => any = () => { };
    public constructor(name: string) {
        this.name = name;

        const cached = FileDownload.cache.get(name);
        if (cached) {
            this._loaded = cached.loaded;
            this._data = cached.data;
            this._dataUrl = cached.dataURL;
        } else {
            FileDownload.cache.set(name, this);

            fetch('/Assets/' + name)
                .then(x => x.blob())
                .then(x => {
                    this._data = x;
                    this._dataUrl = URL.createObjectURL(x);
                    this._loaded = true;
                    this.onload();
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
        return this._dataUrl;
    }
}
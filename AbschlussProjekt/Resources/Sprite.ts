import { File } from './File.js';

export class Sprite {
    public image: HTMLImageElement;
    public file: File;
    public loaded: boolean = false;
    public constructor(file: File) {
        this.file = file;
        this.image = new Image();
        this.image.onload = () => this.loaded = true;
        this.image.src = file.dataURL;
    }
}
import { File } from './File.js';

export class Sprite {
    public image: HTMLImageElement;
    public file: File;
    public constructor(file: File) {
        this.file = file;
        this.image = new Image();
        this.image.src = file.dataURL;
    }
}
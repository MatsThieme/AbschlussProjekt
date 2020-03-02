import { FileDownload } from './FileDownload.js';
import { Vector2 } from '../Vector2.js';

export class Sprite {
    public image: HTMLImageElement;
    public file: FileDownload;
    public size: Vector2;
    public constructor(file: FileDownload) {
        this.file = file;
        this.image = new Image();

        if (!file.loaded) file.onload = () => this.image.src = file.dataURL;

        this.size = new Vector2(this.image.width, this.image.height);
    }
}
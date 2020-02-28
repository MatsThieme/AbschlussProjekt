export class Sprite {
    constructor(file) {
        this.loaded = false;
        this.file = file;
        this.image = new Image();
        this.image.onload = () => this.loaded = true;
        this.image.src = file.dataURL;
    }
}

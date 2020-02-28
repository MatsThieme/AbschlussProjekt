export class Image {
    constructor(file) {
        this.file = file;
        this.image = new window.Image();
        this.image.src = file.dataURL;
    }
}

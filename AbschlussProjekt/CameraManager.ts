import { Camera } from './Camera.js';

export class CameraManager {
    public cameras: Camera[];
    public activeCameraIndex: number;
    public constructor() {
        this.cameras = [];
        this.activeCameraIndex = 0;
    }
    public get activeCamera(): Camera {
        return this.cameras[this.activeCameraIndex];
    }
    public addCamera(camera: Camera) {
        this.cameras.push(camera);
    }
}
import { Camera } from './Components/Camera.js';

export class CameraManager {
    private context: CanvasRenderingContext2D;
    public cameras: Camera[];
    public mainCameraIndex: number;
    public constructor(domElement: HTMLCanvasElement) {
        this.cameras = [];
        this.mainCameraIndex = 0;
        this.context = <CanvasRenderingContext2D>domElement.getContext('2d');
    }
    public get activeCamera(): Camera {
        return this.cameras[this.mainCameraIndex % this.cameras.length];
    }
    public render() {
        this.context.drawImage(this.cameras[this.mainCameraIndex].currentFrame, 0, 0);
    }
}
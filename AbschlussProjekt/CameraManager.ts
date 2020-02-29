import { Camera } from './Camera.js';
import { Vector2 } from './Vector2.js';

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
        return this.cameras[this.mainCameraIndex];
    }
    public addCamera(resolution: Vector2): Camera {
        const newCamera = new Camera(resolution);
        this.cameras.push(newCamera);
        return newCamera;
    }
    public render() {
        this.context.drawImage(this.cameras[this.mainCameraIndex].currentFrame, 0, 0);
    }
}
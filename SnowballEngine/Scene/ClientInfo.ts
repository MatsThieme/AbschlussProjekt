import { Vector2 } from './Vector2.js';
import { reduce } from './Helpers.js';

export class ClientInfo {
    public static measureMonitorFrameRate(ms: number): Promise<number> {
        return new Promise(resolve => {
            let frames: number = 0;

            let handle = requestAnimationFrame(update);

            function update() {
                handle = requestAnimationFrame(update);
            }

            setTimeout(() => {
                resolve(frames / ms);
                cancelAnimationFrame(handle);
            }, ms);
        });
    }
    public static resolution: Vector2 = new Vector2(innerWidth, innerHeight);
    public static aspectRatio: Vector2 = reduce(ClientInfo.resolution);
    public static readonly cpuThreads: number = navigator.hardwareConcurrency;
    private static start() {
        window.addEventListener('resize', () => {
            this.resolution.x = innerWidth;
            this.resolution.y = innerHeight;
            
            this.aspectRatio.x = reduce(ClientInfo.resolution).x;
            this.aspectRatio.y = reduce(ClientInfo.resolution).y;
        });
    }
}

(<any>ClientInfo).start();
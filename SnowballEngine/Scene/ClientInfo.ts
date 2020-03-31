import { Vector2 } from './Vector2.js';

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
    public static readonly cpuThreads: number = navigator.hardwareConcurrency;
    private static start() {
        setInterval(() => {
            this.resolution.x = innerWidth;
            this.resolution.y = innerHeight;
        }, 500);
    }
}

(<any>ClientInfo).start();
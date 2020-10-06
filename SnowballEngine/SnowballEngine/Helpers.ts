import { Asset } from './Assets/Asset.js';
import { AssetType } from './Assets/AssetType.js';

/**
 * 
 * Clamps a number between min and max.
 * 
 */
export const clamp = (min: number, max: number, val: number) => val < min ? min : val > max ? max : val;

/**
 * 
 * Resolves after ms.
 * 
 * @param ms milliseconds to wait before resolve.
 * 
 */
export const asyncTimeout = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 *
 * Computes the linear interpolation between a and b for the parameter t.
 *
 */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * 
 * Calculate the average of numbers.
 * 
 */
export const average = (...numbers: number[]): number => numbers.reduce((t, c) => { t += c; return t; }) / numbers.length;

/**
 * 
 * Execute code that may only be executed in a user event triggered context, e.g. fullscreen api or pointerlock api.
 * 
 * @param cb Call on user event.
 * @param params Parameters to pass the callback on user event.
 * 
 * @returns Returns Promise which resolves as result of callback.
 * 
 */
export function triggerOnUserInputEvent<T>(cb: (...[]) => T, params: any[] = []): Promise<T> {
    return new Promise((resolve, reject) => {
        function end(e: MouseEvent | KeyboardEvent | TouchEvent) {
            if (!e.isTrusted) return;

            try {
                const result = cb(...params);
                resolve(result);
            }
            catch (error) {
                console.log(error);
            }

            window.removeEventListener('mousedown', end);
            window.removeEventListener('mouseup', end);
            window.removeEventListener('keypress', end);
            window.removeEventListener('keyup', end);
            window.removeEventListener('touchstart', end);
        }

        window.addEventListener('mousedown', end);
        window.addEventListener('mouseup', end);
        window.addEventListener('keypress', end);
        window.addEventListener('touchstart', end);
        window.addEventListener('touchmove', end);
    });
}

/**
 * 
 * Simplified version of setInterval, the interval can be cleared by calling cb's parameter clear.
 * 
 */
export function interval(cb: (clear: () => void) => void, ms: number): void {
    const i = window.setInterval(() => cb(() => window.clearInterval(i)), ms);
}

export function createSprite(f: (context: OffscreenCanvasRenderingContext2D, canvas: OffscreenCanvas) => any, width: number = 100, height: number = 100): Asset {
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d')!;
    context.imageSmoothingEnabled = false;
    f(context, canvas);

    return new Asset('', AssetType.Image, canvas);
}
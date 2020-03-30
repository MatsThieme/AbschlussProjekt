import { Vector2 } from './Scene/Vector2.js';

/**
 * 
 * Clamps a number between min and max.
 * 
 */
export const clamp = (min: number, max: number, val: number) => val < min ? min : val > max ? max : val;

/**
 * Resolves after ms
 * 
 * @param ms milliseconds to wait before resolve
 * 
 */
export const asyncTimeout = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Reduces a fraction.
 *
 * @param fraction fraction.x is the numerator, fraction.x the denominator.
 * 
 */
export function reduce(fraction: Vector2): Vector2 {
    const x = (a: number, b: number): number => b ? x(b, a % b) : a;
    const gcd = x(fraction.x, fraction.y);
    return new Vector2(fraction.x / gcd, fraction.y / gcd);
}

/**
 * Execute code that may only be executed in a user event triggered context.
 * 
 * @param cb Call on user event.
 * @param params Params to pass the callback on user event.
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
 * Returned Promise<T> resolves when all passed promises are resolved.
 * 
 */
export function awaitPromises<T>(...promises: Promise<T>[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
        if (promises.length === 0) return resolve([]);
        const ret: T[] = [];
        promises.forEach(p => p.then((t: T) => ret.push(t) === promises.length ? resolve(ret) : undefined));
    });
}

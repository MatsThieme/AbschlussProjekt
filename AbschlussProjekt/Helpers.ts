import { Vector2 } from './Scene/Vector2.js';

export const clamp = (min: number, max: number, val: number) => val < min ? min : val > max ? max : val;
export const asyncTimeout = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export function reduce(fraction: Vector2): Vector2 {
    const x = (a: number, b: number): number => b ? x(b, a % b) : a;
    const gcd = x(fraction.x, fraction.y);
    return new Vector2(fraction.x / gcd, fraction.y / gcd);
}

export const measureTimePromise = async (func: () => Promise<any>): Promise<number> => {
    const start = performance.now();
    await func();
    return performance.now() - start;
}

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

export function awaitPromises<T>(...promises: Promise<T>[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
        if (promises.length === 0) return resolve([]);
        const ret: T[] = [];
        promises.forEach(p => p.then((t: T) => ret.push(t) === promises.length ? resolve(ret) : undefined));
    });
}

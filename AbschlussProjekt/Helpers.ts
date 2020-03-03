export const clamp = (min: number, max: number, val: number) => val < min ? min : val > max ? max : val;
export const asyncTimeout = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
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
            window.removeEventListener('mousemove', end);
            window.removeEventListener('mouseup', end);
            window.removeEventListener('keypress', end);
            window.removeEventListener('keyup', end);
            window.removeEventListener('mouseover', end);
            window.removeEventListener('touchstart', end);
            window.removeEventListener('touchmove', end);
        }

        window.addEventListener('mousedown', end);

        window.addEventListener('mouseup', end);
        window.addEventListener('keypress', end);
        window.addEventListener('touchstart', end);
        window.addEventListener('touchmove', end);
    });
}
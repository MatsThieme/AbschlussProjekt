export const clamp = (min: number, max: number, val: number) => val < min ? min : val > max ? max : val;
export const asyncTimeout = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
export const measureTimePromise = async (func: () => Promise<any>): Promise<number> => {
    const start = performance.now();
    await func();
    return performance.now() - start;
}
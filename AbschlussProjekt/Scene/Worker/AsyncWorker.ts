export class AsyncWorker {
    public static maxWorkers: number = navigator.hardwareConcurrency;
    private static workers: Map<string, Worker[]> = new Map();
    private static queue: { url: string, data: any, resolve: (value?: any) => void, reject: (value?: any) => void }[] = [];
    private static async work(): Promise<any> {
        const { url, data, resolve, reject } = AsyncWorker.queue.splice(0, 1)[0];
        const worker: Worker | undefined = await AsyncWorker.getWorker(url);

        if (!worker || worker.onmessage !== worker.onerror) {
            AsyncWorker.queue.unshift({ url, data, resolve, reject });
            return;
        }

        worker.isBusy = true;
        worker.onerror = reject;
        worker.onmessage = e => {
            resolve(e.data);
            worker.onmessage = worker.onerror = null;
            worker.isBusy = false;

            if (AsyncWorker.queue.length > 0) AsyncWorker.work();
        };

        worker.postMessage(data);
    }
    public static task(url: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            AsyncWorker.queue.push({ url, data, resolve, reject });
            AsyncWorker.work();
            console.log(AsyncWorker.queue.length);
        });
    }
    private static async getWorker(url: string): Promise<Worker | undefined> {
        let worker: Worker | undefined = AsyncWorker.workers.get(url)?.filter(worker => !worker.isBusy)[0];

        if (!worker && ((AsyncWorker.workers.get(url)?.length || 0) < AsyncWorker.maxWorkers)) worker = (await AsyncWorker.createWorker(url, 1))[0];

        if (!worker) console.error('no worker available');

        return worker;
    }
    public static removeWorker(url: string, count: number): void {
        const workers = AsyncWorker.workers.get(url);
        if (workers) {
            const length = workers.length
            workers.sort((a, b) => (<any>a.isBusy) - (<any>b.isBusy)).splice(0, Math.min(count, length)).forEach(w => w.postMessage('close'));
            AsyncWorker.workers.set(url, workers);
        }
    }
    public static createWorker(url: string, count: number): Promise<Worker[]> {
        return new Promise((resolve, reject) => {
            const w: Worker[] = [];

            let complete = 0;
            for (let i = 0; i < count; i++) {
                w[i] = <any>new Worker(url);
                w[i].isBusy = false;
                AsyncWorker.warmup(w[i]).then(() => {
                    if (++complete === count) resolve(w);
                });
            }

            AsyncWorker.workers.set(url, [...(AsyncWorker.workers.get(url) || []), ...w]);
        });
    }
    private static warmup(worker: Worker): Promise<void> {
        return new Promise((resolve, reject) => {
            worker.postMessage(undefined);
            worker.onmessage = () => {
                worker.onmessage = null;
                resolve();
            }
        });
    }
}

(<any>window).AsyncWorker = AsyncWorker;

/** @internal */
declare interface Worker extends EventTarget, AbstractWorker {
    isBusy: boolean;
    onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
    postMessage(message: any, transfer: Transferable[]): void;
    postMessage(message: any, options?: PostMessageOptions): void;
    terminate(): void;
    addEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
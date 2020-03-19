export class AsyncWorker {
    private static workers: Map<string, Worker[]> = new Map();
    public static work<T>(url: string, data: any): Promise<T> {
        return new Promise((resolve, reject) => {
            let worker: Worker = AsyncWorker.getWorker(url);

            worker.onerror = e => reject(e.error);
            worker.onmessage = e => {
                worker.onmessage = null;
                worker.onerror = null;
                resolve(e.data);
                worker.inQueue--;
            };

            worker.inQueue++;
            worker.postMessage(data);
        });
    }
    private static getWorker(url: string): Worker {
        let worker: Worker = <Worker>AsyncWorker.workers.get(url)?.sort((a, b) => a.inQueue - b.inQueue)[0];

        if (!worker) {
            AsyncWorker.createWorker(url, 1);
            return AsyncWorker.getWorker(url);
        }

        return worker;
    }
    public static createWorker(url: string, count: number): Promise<void> {
        return new Promise((resolve, reject) => {
            AsyncWorker.workers.get(url)?.forEach(w => w.postMessage('close')); // close old workers

            const w: Worker[] = [];

            let complete = 0;
            for (let i = 0; i < count; i++) {
                w[i] = <any>new Worker(url, { type: 'module' });
                w[i].inQueue = 0;
                AsyncWorker.warmup(w[i]).then(() => {
                    if (++complete === count) resolve();
                });
            }

            AsyncWorker.workers.set(url, w);
        });
    }
    private static warmup(worker: Worker): Promise<void> {
        return new Promise((resolve, reject) => {
            worker.postMessage(undefined);
            worker.inQueue++;
            worker.onmessage = () => {
                worker.onmessage = null;
                worker.inQueue--;
                resolve();
            }
        });
    }
}


/** @internal */
declare interface Worker extends EventTarget, AbstractWorker {
    inQueue: number;
    onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
    postMessage(message: any, transfer: Transferable[]): void;
    postMessage(message: any, options?: PostMessageOptions): void;
    terminate(): void;
    addEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
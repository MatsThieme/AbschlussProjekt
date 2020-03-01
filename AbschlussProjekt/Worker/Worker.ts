export class AsyncWorker {
    private static workers: Map<string, Worker> = new Map();
    public static work<T>(url: string, data: any): Promise<T> {
        return new Promise((resolve, reject) => {
            const worker = AsyncWorker.workers.has(url) ? <Worker>AsyncWorker.workers.get(url) : new Worker(url, { type: 'module' });
            AsyncWorker.workers.set(url, worker);

            worker.addEventListener('error', e => reject(e.error));
            worker.addEventListener('message', e => resolve(e.data));

            worker.postMessage(data);
        });
    }
}
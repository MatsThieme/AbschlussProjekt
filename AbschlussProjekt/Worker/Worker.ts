export class AsyncWorker {
    private static workers: Map<string, Worker> = new Map();
    public static work<T>(url: string, data: { name: string, parameters?: any[] } = { name: '', parameters: [] }): Promise<T> {
        return new Promise((resolve, reject) => {
            let worker;

            if (AsyncWorker.workers.has(url)) {
                worker = <Worker>AsyncWorker.workers.get(url);
            } else {
                worker = new Worker(url, { type: 'module' });
                AsyncWorker.workers.set(url, worker);
            }

            worker.addEventListener('error', e => reject(e.error));
            worker.addEventListener('message', e => resolve(e.data));

            worker.postMessage(data);
        });
    }
    public static close(url: string): void {
        AsyncWorker.workers.get(url)?.postMessage('close');
    }
}
self.addEventListener('message', async (e: MessageEvent) => {
    if (!e.data) return postMessage(0);
    if (!e.isTrusted || e.data.name === 'close') return close();

    if (e.data && typeof e.data.name === 'string' && e.data.data) return postMessage(await (await import(`/Scene/Physics/${e.data.name}.js`))[e.data.name](e.data.data));

    return postMessage(0);
});

/** @internal */
declare function postMessage(msg: any): void;
self.addEventListener('message', async (e: MessageEvent) => {
    if (!e.data) return postMessage(0);
    if (!e.isTrusted || e.data.name === 'close') return close();

    const funcName = ((<string>e.data.name).match(/.*\/(\w+).js/) || ' ')[0];
    console.log(e.data.name, funcName);
    if (funcName.length < 2) return postMessage(0);
    if (e.data && typeof e.data.name === 'string' && e.data.data) return postMessage(await (await import(e.data.name))[funcName](e.data.data));

    return postMessage(0);
});

/** @internal */
declare function postMessage(msg: any): void;
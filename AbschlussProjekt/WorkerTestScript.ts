addEventListener('message', e => {
    let x = 99;
    for (let i = 1; i < e.data; i++) {
        x += i / 2 * 2;
    }

    postMessage(x);
    close();
});

declare function postMessage(msg: any): void;
export class FontLoader {
    public static load(url: string, name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const e = document.querySelector('style') || document.createElement('style');
            e.innerHTML += `@font-face { font-family: ${name}; src: url('${url}'); }`;
            document.head.appendChild(e);

            const p = document.createElement('span');
            p.textContent = 'IWM'.repeat(10);
            p.style.fontFamily = 'serif';
            p.style.visibility = 'hidden';
            document.body.appendChild(p);

            const initialWidth = p.offsetWidth;

            p.style.fontFamily = name;

            const i = setInterval(() => {
                if (p.offsetWidth !== initialWidth) {
                    resolve();
                    p.remove();
                    clearInterval(i);
                }
            }, 1);
        });
    }
}
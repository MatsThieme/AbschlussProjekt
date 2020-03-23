self.addEventListener('message', (e: MessageEvent) => {
    if (!e.data) return postMessage(0);
    if (!e.isTrusted || e.data.name === 'close') return close();


    return postMessage(PolygonCircleCollisionWorker(e.data));
});

/** @internal */
declare function postMessage(msg: any): void;



function PolygonCircleCollisionWorker(data: { A: { x: number, y: number }[], B: { position: { x: number, y: number }, radius: number } }): { contacts: { x: number, y: number }[], penetrationDepth: number, normal: { x: number, y: number } } | undefined {
    const { A, B } = data;

    const APos = vecAvg_(...A);

    const contacts: { x: number, y: number }[] = [];

    for (let i = 0; i < A.length; i++) {
        contacts.push(...lineIntersectsCircle(A[i % A.length], A[(i + 1) % A.length], B.position, B.radius));
    }

    if (contacts.length === 0) return;

    const normal = { x: -(APos.x - B.position.x), y: -(APos.y - B.position.y) };

    const penetrationDepth = B.radius - distance(vecAvg_(...contacts), B.position);

    return { contacts, penetrationDepth, normal };
}

function distance(v1: { x: number, y: number }, v2: { x: number, y: number }) {
    return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
}

function lineIntersectsCircle(a: { x: number, y: number }, b: { x: number, y: number }, position: { x: number, y: number }, radius: number): { x: number, y: number }[] {
    let s = { x: b.x - a.x, y: b.y - a.y };
    let smag = Math.sqrt(s.x ** 2 + s.y ** 2);
    s = { x: s.x / smag, y: s.y / smag };

    const t = (position.x - a.x) * s.x + (position.y - a.y) * s.y;

    const E = { x: s.x * t + a.x, y: s.y * t + a.y };

    const LEC = distance(position, E);

    if (LEC < radius) {
        const dt = Math.sqrt(radius ** 2 - LEC ** 2)

        return [{ x: s.x * (t - dt) + a.x, y: s.y * (t - dt) + a.y }, { x: s.x * (t + dt) + a.x, y: s.y * (t + dt) + a.y }];
    } else if (LEC == radius) return [E];

    return [];
}


function vecAvg_(...vecs: { x: number, y: number }[]) {
    const ret = { x: 0, y: 0 };

    for (const vec of vecs) {
        ret.x += vec.x;
        ret.y += vec.y;
    }

    ret.x /= vecs.length;
    ret.y /= vecs.length;

    return ret;
}
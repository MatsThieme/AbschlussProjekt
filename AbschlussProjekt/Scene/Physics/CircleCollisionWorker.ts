self.addEventListener('message', (e: MessageEvent) => {
    if (!e.data) return postMessage(0);
    if (!e.isTrusted || e.data.name === 'close') return close();


    return postMessage(PhysicsWorkerCircleCollision(e.data));
});

/** @internal */
declare function postMessage(msg: any): void;



function PhysicsWorkerCircleCollision(data: { A: { position: { x: number, y: number }, radius: number }, B: { position: { x: number, y: number }, radius: number } }): { contacts: { x: number, y: number }[], penetrationDepth: number, normal: { x: number, y: number } } | undefined {
    const { A, B } = data;

    const AB = { x: B.position.x - A.position.x, y: B.position.y - A.position.y };
    const ABMag = (AB.x ** 2 + AB.y ** 2) ** 0.5;
    if (ABMag > A.radius + B.radius) return;
    const penetrationDepth = ABMag != 0 ? A.radius + B.radius - ABMag : Math.max(A.radius, B.radius);
    const normal = ABMag != 0 ? { x: AB.x / ABMag, y: AB.y / ABMag } : { x: 1, y: 0 };

    const contacts = [{ x: normal.x * (A.radius - penetrationDepth / 2 * (A.radius / B.radius)) + A.position.x, y: normal.y * (A.radius - penetrationDepth / 2 * (A.radius / B.radius)) + A.position.y }];

    return { contacts, penetrationDepth, normal };
}
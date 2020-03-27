self.addEventListener('message', (e: MessageEvent) => {
    if (!e.data) return postMessage(0);
    if (e.data === 'close') return close();

    if (e.data.name === 'p') {
        return postMessage(PhysicsWorkerPolygonCollision(e.data.data));
    } else if (e.data.name === 'c') {
        return postMessage(PhysicsWorkerCircleCollision(e.data.data));
    } else if (e.data.name === 'pc') {
        return postMessage(PolygonCircleCollisionWorker(e.data.data));
    }
});

/** @internal */
declare function postMessage(msg: any): void;


function PhysicsWorkerCircleCollision(data: { A: { position: { x: number, y: number }, radius: number }, B: { position: { x: number, y: number }, radius: number } }): { contacts: { x: number, y: number }[], penetrationDepth: number, normal: { x: number, y: number } } | undefined {
    const { A, B } = data;

    const AB = { x: B.position.x - A.position.x, y: B.position.y - A.position.y };
    const ABMag = Math.sqrt(AB.x ** 2 + AB.y ** 2);
    if (ABMag > A.radius + B.radius) return;
    const penetrationDepth = ABMag != 0 ? A.radius + B.radius - ABMag : Math.max(A.radius, B.radius);
    const normal = ABMag != 0 ? { x: AB.x / ABMag, y: AB.y / ABMag } : { x: 1, y: 0 };

    const contacts = [{ x: normal.x * (A.radius - penetrationDepth / 2 * (A.radius / B.radius)) + A.position.x, y: normal.y * (A.radius - penetrationDepth / 2 * (A.radius / B.radius)) + A.position.y }];

    return { contacts, penetrationDepth, normal };
}

function PhysicsWorkerPolygonCollision(data: { A: { x: number, y: number }[], B: { x: number, y: number }[] }): { contacts: { x: number, y: number }[], penetrationDepth: number, normal: { x: number, y: number } } | undefined {
    const { A, B } = data;
    const AFaces = A.map((v, i) => new Face(A[i % A.length], A[(i + 1) % A.length]));
    const BFaces = B.map((v, i) => new Face(B[i % B.length], B[(i + 1) % B.length]));

    const APos = vecAvg(...A);
    const BPos = vecAvg(...B);

    let leastPenetration: number = Infinity;
    let referenceIndex!: number;
    let referenceCollider!: string;

    for (let i = 0; i < AFaces.length; i++) {
        const aP = project(AFaces[i].normal, A);
        const bP = project(AFaces[i].normal, B);

        const overlap = Math.min(aP.max, bP.max) - Math.max(aP.min, bP.min);

        if (overlap < 0) {
            return;
        } else {
            if (overlap <= leastPenetration) {
                leastPenetration = overlap;
                referenceIndex = i;
                referenceCollider = 'A';
            }
        }
    }

    for (let i = 0; i < BFaces.length; i++) {
        const aP = project(BFaces[i].normal, A);
        const bP = project(BFaces[i].normal, B);

        const overlap = Math.min(aP.max, bP.max) - Math.max(aP.min, bP.min);

        if (overlap < 0) {
            return;
        } else {
            if (overlap < leastPenetration) {
                leastPenetration = overlap;
                referenceIndex = i;
                referenceCollider = 'B';
            }
        }
    }

    let leastPenetrationNormal = referenceCollider === 'A' ? AFaces[referenceIndex].normal : BFaces[referenceIndex].normal;

    const APosN = { x: APos.x + leastPenetrationNormal.x, y: APos.y + leastPenetrationNormal.y };
    const APosNF = { x: APos.x - leastPenetrationNormal.x, y: APos.y - leastPenetrationNormal.y };

    if ((BPos.x - APosN.x) ** 2 + (BPos.y - APosN.y) ** 2 > (BPos.x - APosNF.x) ** 2 + (BPos.y - APosNF.y) ** 2) leastPenetrationNormal = { x: -leastPenetrationNormal.x, y: -leastPenetrationNormal.y };


    const contacts: { x: number, y: number }[] = [];

    for (const faceA of AFaces) {
        for (const faceB of BFaces) {
            const contact = getLineIntersection(faceA.v1.x, faceA.v1.y, faceA.v2.x, faceA.v2.y, faceB.v1.x, faceB.v1.y, faceB.v2.x, faceB.v2.y);
            if (contact) contacts.push(contact);
        }
    }
    if (contacts.length === 0) return;
    return { contacts, penetrationDepth: leastPenetration, normal: leastPenetrationNormal };
}

function PolygonCircleCollisionWorker(data: { A: { x: number, y: number }[], B: { position: { x: number, y: number }, radius: number } }): { contacts: { x: number, y: number }[], penetrationDepth: number, normal: { x: number, y: number } } | undefined {
    const { A, B } = data;

    const APos = vecAvg(...A);

    const contacts: { x: number, y: number }[] = [];

    let leastPenetrationNormal!: { x: number, y: number };
    let leastPenetration: number = Infinity;

    for (let i = 0; i < A.length; i++) {
        const n = { x: A[(i + 1) % A.length].x - A[i % A.length].x, y: -(A[(i + 1) % A.length].y - A[i % A.length].y) };
        const projection = projectCircle(n, B, A);

        if (projection > 0 && projection < leastPenetration) {
            leastPenetration = projection;
            leastPenetrationNormal = n;
        }

        contacts.push(...lineIntersectsCircle(A[i % A.length], A[(i + 1) % A.length], B.position, B.radius));
    }

    if (contacts.length === 0 || leastPenetration === Infinity) return;


    const APosN = { x: APos.x + leastPenetrationNormal.x, y: APos.y + leastPenetrationNormal.y };
    const APosNF = { x: APos.x - leastPenetrationNormal.x, y: APos.y - leastPenetrationNormal.y };

    if ((B.position.x - APosN.x) ** 2 + (B.position.y - APosN.y) ** 2 > (B.position.x - APosNF.x) ** 2 + (B.position.y - APosNF.y) ** 2) leastPenetrationNormal = { x: -leastPenetrationNormal.x, y: -leastPenetrationNormal.y };


    const penetrationDepth = B.radius - distance(vecAvg(...contacts), B.position);

    return { contacts, penetrationDepth, normal: leastPenetrationNormal };
}

function projectCircle(axis: { x: number, y: number }, circle: { position: { x: number, y: number }, radius: number }, poly: { x: number, y: number }[]): number {
    let min = Infinity;
    let max = -Infinity;

    for (const vertex of poly) {
        const product = dot(axis, vertex);
        if (product < min) {
            min = product;
        }
        if (product > max) {
            max = product;
        }
    }

    const cmin: number = dot(axis, circle.position) - circle.radius;
    const cmax: number = dot(axis, circle.position) + circle.radius;


    return Math.min(max, cmax) - Math.max(min, cmin);
}

function project(axis: { x: number, y: number }, vertices: { x: number, y: number }[]): { min: number, max: number } {
    let min = Infinity;
    let max = -Infinity;

    for (const vertex of vertices) {
        const product = axis.x * vertex.x + axis.y * vertex.y;
        if (product < min) min = product;
        if (product > max) max = product;
    }

    return { min, max };
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

function vecAvg(...vecs: { x: number, y: number }[]) {
    const ret = { x: 0, y: 0 };

    for (const vec of vecs) {
        ret.x += vec.x;
        ret.y += vec.y;
    }

    ret.x /= vecs.length;
    ret.y /= vecs.length;

    return ret;
}


function normalizeVec(vec: { x: number, y: number }): { x: number, y: number } {
    const mag = (vec.x ** 2 + vec.y ** 2) ** 0.5;
    return { x: vec.x / mag, y: vec.y / mag };
}

class Face {
    public v1: { x: number, y: number };
    public v2: { x: number, y: number };
    public normal: { x: number, y: number };
    public constructor(v1: { x: number, y: number }, v2: { x: number, y: number }) {
        this.v1 = v1;
        this.v2 = v2;
        this.normal = normalizeVec({ x: -(v1.y - v2.y), y: v1.x - v2.y }); /* v1.clone.sub(v2).perpendicularCounterClockwise.normalize();*/
    }
}


function cross(a: { x: number, y: number }, b: { x: number, y: number }): number {
    return a.x * b.y - a.y * b.x;
}
function dot(a: { x: number, y: number }, b: { x: number, y: number }): number {
    return a.x * b.x + a.y * b.y;
}


//https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
function getLineIntersection(p0_x: number, p0_y: number, p1_x: number, p1_y: number, p2_x: number, p2_y: number, p3_x: number, p3_y: number): { x: number, y: number } | undefined {
    let s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;

    const s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        return { x: p0_x + (t * s1_x), y: p0_y + (t * s1_y) };
    }

    return;
} 
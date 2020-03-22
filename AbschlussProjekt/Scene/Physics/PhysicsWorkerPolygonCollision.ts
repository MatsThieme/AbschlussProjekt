









function PhysicsWorkerPolygonCollision(data: { A: { x: number, y: number }[], B: { x: number, y: number }[] }): { contacts: { x: number, y: number }[], penetrationDepth: number, normal: { x: number, y: number } } | undefined {
    const { A, B } = data;
    const AFaces = A.map((v, i) => new Face(A[i % A.length], A[i % A.length]));
    const BFaces = B.map((v, i) => new Face(B[i % B.length], B[i % B.length]));

    let leastPenetration: number = Infinity;
    let referenceIndex!: number;
    let incidentCollider!: string;
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
                incidentCollider = 'B';
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
                incidentCollider = 'A';
            }
        }
    }

    const leastPenetrationNormal = referenceCollider === 'A' ? AFaces[referenceIndex].normal : BFaces[referenceIndex].normal;

    const contacts: { x: number, y: number }[] = [];

    for (const faceA of AFaces) {
        for (const faceB of BFaces) {
            const contact = faceA.line.intersects(faceB.line);
            if (contact) contacts.push(contact);
        }
    }

    return { contacts, penetrationDepth: leastPenetration, normal: leastPenetrationNormal };
}


function project(axis: { x: number, y: number }, vertices: { x: number, y: number }[]): any {
    let min = Infinity;
    let max = -Infinity;

    for (const vertex of vertices) {
        const product = axis.x * vertex.x + axis.y * vertex.y;
        if (product < min) min = product;
        if (product > max) max = product;
    }

    return { min, max };
}


export class Face {
    public v1: { x: number, y: number };
    public v2: { x: number, y: number };
    public normal: { x: number, y: number };
    public line: Line;
    public constructor(v1: { x: number, y: number }, v2: { x: number, y: number }) {
        this.v1 = v1;
        this.v2 = v2;
        this.normal = this.normalizeVec({ x: -(v1.y - v2.y), y: v1.x - v2.y }); /* v1.clone.sub(v2).perpendicularCounterClockwise.normalize();*/
        this.line = new Line(v1, v2);
    }
    private normalizeVec(vec: { x: number, y: number }): { x: number, y: number } {
        const mag = (vec.x ** 2 + vec.y ** 2) ** 0.5;
        return { x: vec.x / mag, y: vec.y / mag };
    }
}


export class Line {
    public a: { x: number, y: number };
    public b: { x: number, y: number };
    public s: { x: number, y: number };
    public constructor(a: { x: number, y: number }, b: { x: number, y: number }) {
        this.a = a;
        this.b = b;
        this.s = { x: b.x - a.x, y: b.y - a.y };
    }
    public intersects(other: Line): { x: number, y: number } | undefined {
        const p = this.a;
        const r = this.s;
        const q = other.a;
        const s = other.s;

        const abc = cross({ x: q.x - p.x, y: q.y - p.y }, r);
        const def = cross({ x: q.x - p.x, y: q.y - p.y }, s);
        const ghi = cross(r, s);

        const u = abc / ghi;

        const t = def / ghi;

        if (abc != 0 && t >= 0 && t <= 1 && u >= 0 && u <= 1) return { x: q.x + s.x * u, y: q.y + s.y * u };
        else return;
    }
    public distanceToPoint(point: { x: number, y: number }): number {
        const w = this.a;
        const v = this.b;


        const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
        if (l2 == 0) return Math.sqrt((point.x - v.x) ** 2 + (point.y - v.y) ** 2);

        const t = Math.max(0, Math.min(1, dot({ x: point.x - v.x, y: point.y - v.y }, { x: w.x - v.x, y: w.y - v.y }) / l2));
        const projection = { x: (w.x - v.x) * t + v.x, y: (w.y - v.y) * t + v.y }
        return Math.sqrt((point.x - projection.x) ** 2 + (point.y - projection.y) ** 2);
    }
}

function cross(a: { x: number, y: number }, b: { x: number, y: number }): number {
    return a.x * b.y - a.y * b.x;
}
function dot(a: { x: number, y: number }, b: { x: number, y: number }): number {
    return a.x * b.x + a.y * b.y;
} 
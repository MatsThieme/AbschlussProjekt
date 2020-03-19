import { Line } from '../Line.js';
import { Vector2 } from '../Vector2.js';

export async function PhysicsWorkerLineIntersection(data: any): Promise<Vector2[]> {
    const contacts: Vector2[] = [];

    const ALines: Line[] = data.ALines.map((f: number[][]) => new Line(new Vector2(f[0][0], f[0][1]), new Vector2(f[1][0], f[1][1])));
    const BLines: Line[] = data.BLines.map((f: number[][]) => new Line(new Vector2(f[0][0], f[0][1]), new Vector2(f[1][0], f[1][1])));

    for (const lineA of ALines) {
        for (const lineB of BLines) {
            const contact = lineA.intersects(lineB);
            if (contact) contacts.push(contact);
        }
    }

    return contacts;
}
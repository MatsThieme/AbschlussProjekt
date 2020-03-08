import { AlignH, AlignV } from '../Align.js';
import { GameObject } from '../GameObject.js';
import { PhysicsMaterial } from '../Physics/PhysicsMaterial.js';
import { Vector2 } from '../Vector2.js';
import { Collider } from './Collider.js';
import { ComponentType } from './ComponentType.js';

export class PolygonCollider extends Collider {
    private _vertices: Vector2[];
    public normals: Vector2[];
    public size: Vector2;
    public radius: number;
    public constructor(gameObject: GameObject, relativePosition: Vector2 = new Vector2(), material: PhysicsMaterial = new PhysicsMaterial(), density: number = 1, vertices: Vector2[] = [new Vector2(1, 1), new Vector2(0, 1), new Vector2()], alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, ComponentType.PolygonCollider, relativePosition, material, density, alignH, alignV);

        this._vertices = this.orderVertices(vertices);
        this.normals = this.calculateNormals();
        this.size = this.computeSize();
        this.radius = Math.max(this.size.x, this.size.y) / 2;
    }
    public set vertices(val: Vector2[]) {
        this._vertices = this.orderVertices(val);
        this.normals = this.calculateNormals();
        this.size = this.computeSize();
        this.radius = Math.max(this.size.x, this.size.y) / 2;
    }
    public get vertices(): Vector2[] {
        return this._vertices.map(v => v.clone.add(this.position));
    }
    private moveVerticesToOrigin(vertices: Vector2[]): Vector2[] {
        const difference = Vector2.average(...vertices);

        for (const vertex of vertices) {
            vertex.sub(difference);
        }

        return vertices;
    }
    private computeSize(): Vector2 {
        let maxX = -Infinity, minX = Infinity, maxY = -Infinity, minY = Infinity;

        for (const vertex of this._vertices) {
            if (vertex.x < minX) minX = vertex.x;
            else if (vertex.x > maxX) maxX = vertex.x;
            if (vertex.y < minY) minY = vertex.y;
            else if (vertex.y > maxY) maxY = vertex.y;
        }

        return new Vector2(maxX - minX, maxY - minY);
    }
    private orderVertices(vertices: Vector2[]): Vector2[] {
        this.moveVerticesToOrigin(vertices);
        return vertices.sort((a, b) => Vector2.up.angleBetween(new Vector2(), a).degree - Vector2.up.angleBetween(new Vector2(), b).degree);
    }
    private calculateNormals(): Vector2[] {
        const normals = [];

        for (let i = 1; i <= this._vertices.length; i++) {
            normals.push(Vector2.sub(this._vertices[i % this._vertices.length], this._vertices[i - 1]).perpendicularClockwise.normalize());
        }

        return normals;
    }
    public project(axis: Vector2): Vector2 { // x=min, y=max
        const ret = new Vector2(Infinity, -Infinity);

        for (const vertex of this.vertices) {
            const product = Vector2.dot(axis, vertex);
            if (product < ret.x) ret.x = product;
            else if (product > ret.y) ret.y = product;
        }

        return ret;
    }
}
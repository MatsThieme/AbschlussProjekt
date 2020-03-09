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
    public constructor(gameObject: GameObject, relativePosition: Vector2 = new Vector2(), material: PhysicsMaterial = new PhysicsMaterial(), density: number = 1, vertices: Vector2[] = [new Vector2(-0.5, 0), new Vector2(0, Math.sqrt(1 - 0.5 ** 2)), new Vector2(0.5, 0)], alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, ComponentType.PolygonCollider, relativePosition, material, density, alignH, alignV);

        this.size = this.computeSize(vertices);

        this.radius = Math.max(this.size.x, this.size.y) / 2;
        this._vertices = this.orderVertices(vertices);
        this.normals = this.calculateNormals(this._vertices);
    }
    public set vertices(vertices: Vector2[]) {
        this.size = this.computeSize(vertices);
        this.radius = Math.max(this.size.x, this.size.y) / 2;
        this._vertices = this.orderVertices(vertices);
        this.normals = this.calculateNormals(this._vertices);
    }
    public get vertices(): Vector2[] {
        return this._vertices.map(v => v.clone.rotateAroundTo(new Vector2(), this.gameObject.transform.relativeRotation).add(this.position));
    }
    public moveVerticesToOrigin(vertices: Vector2[], origin: Vector2 = new Vector2()): Vector2[] {
        const topLeft = new Vector2(Infinity, -Infinity);

        for (const vertex of vertices) {
            if (vertex.x < topLeft.x) topLeft.x = vertex.x;
            if (vertex.y > topLeft.y) topLeft.y = vertex.y;
        }

        const center = topLeft.add(new Vector2(this.size.x / 2, -this.size.y / 2));

        const difference = Vector2.average(...vertices);

        for (const vertex of vertices) {
            vertex.sub(center).add(origin);
        }

        return vertices;
    }
    private computeSize(vertices: Vector2[]): Vector2 {
        let maxX = -Infinity, minX = Infinity, maxY = -Infinity, minY = Infinity;

        for (const vertex of vertices) {
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
    private calculateNormals(vertices: Vector2[]): Vector2[] {
        const normals = [];

        for (let i = 1; i <= vertices.length; i++) {
            normals.push(Vector2.sub(vertices[i % vertices.length], vertices[i - 1]).perpendicularCounterClockwise.normalize());
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
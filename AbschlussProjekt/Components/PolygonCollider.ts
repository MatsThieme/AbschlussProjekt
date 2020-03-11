import { AlignH, AlignV } from '../Align.js';
import { GameObject } from '../GameObject.js';
import { AABB } from '../Physics/AABB.js';
import { PhysicsMaterial } from '../Physics/PhysicsMaterial.js';
import { Vector2 } from '../Vector2.js';
import { Collider } from './Collider.js';
import { ComponentType } from './ComponentType.js';
import { GameTime } from '../GameTime.js';

export class PolygonCollider extends Collider {
    protected _aabb: AABB;
    protected _area: number;
    public scaledSize: Vector2;
    private _vertices: Vector2[];
    public normals: Vector2[];
    public constructor(gameObject: GameObject, relativePosition: Vector2 = new Vector2(), material: PhysicsMaterial = new PhysicsMaterial(), density: number = 1, vertices: Vector2[] = [new Vector2(-0.5, 0), new Vector2(0, Math.sqrt(1 - 0.5 ** 2)), new Vector2(0.5, 0)], alignH: AlignH = AlignH.Center, alignV: AlignV = AlignV.Center) {
        super(gameObject, ComponentType.PolygonCollider, relativePosition, material, density, alignH, alignV);

        this.scaledSize = this.computeSize(vertices);
        this._vertices = this.orderVertices(vertices);
        this.normals = this.computeNormals(this._vertices);
        this._area = this.computeArea();
        this._aabb = this.computeAABB();
    }
    public set vertices(vertices: Vector2[]) {
        this.scaledSize = this.computeSize(vertices);
        this._vertices = this.orderVertices(vertices);
        this.normals = this.computeNormals(this._vertices);
        this._area = this.computeArea();
        this._aabb = this.computeAABB();
    }
    public get vertices(): Vector2[] {
        return this._vertices.map(v => v.clone.scale(this.gameObject.transform.relativeScale).rotateAroundTo(new Vector2(), this.gameObject.transform.relativeRotation).add(this.position));
    }
    public centerPointsAt(vertices: Vector2[], center: Vector2 = new Vector2()): Vector2[] {
        const difference = Vector2.average(...vertices);

        for (const vertex of vertices) {
            vertex.sub(difference).add(center);
        }

        return vertices;
    }
    private computeSize(vertices: Vector2[]): Vector2 {
        let maxX = -Infinity, minX = Infinity, maxY = -Infinity, minY = Infinity;

        for (const vertex of vertices) {
            if (vertex.x < minX) minX = vertex.x;
            if (vertex.x > maxX) maxX = vertex.x;
            if (vertex.y < minY) minY = vertex.y;
            if (vertex.y > maxY) maxY = vertex.y;
        }

        return new Vector2(maxX - minX, maxY - minY);
    }
    private orderVertices(vertices: Vector2[]): Vector2[] {
        return this.centerPointsAt(vertices).sort((a, b) => Vector2.up.angleBetween(new Vector2(), a).degree - Vector2.up.angleBetween(new Vector2(), b).degree);
    }
    private computeNormals(vertices: Vector2[]): Vector2[] {
        const normals = [];

        for (let i = 1; i <= vertices.length; i++) {
            normals.push(Vector2.sub(vertices[i % vertices.length], vertices[i - 1]).perpendicularClockwise.normalize());
        }

        return normals;
    }
    public project(axis: Vector2): Vector2 { // x=min, y=max
        const ret = new Vector2(Infinity, -Infinity);

        for (const vertex of this.vertices) {
            const product = Vector2.dot(axis, vertex);
            if (product < ret.x) ret.x = product;
            if (product > ret.y) ret.y = product;
        }

        return ret;
    }
    private computeArea(): number {
        let area = 0;
        const vertices = this.vertices;

        for (let i = 1; i < this.vertices.length; i++) {
            area += (vertices[i - 1].x + vertices[i].x) * (vertices[i - 1].y - vertices[i].y);
        }

        return area / 2;
    }
    private computeAABB(): AABB {
        const topLeft = new Vector2(Infinity, -Infinity);

        const vs = this.vertices;

        for (const vertex of vs) {
            if (vertex.x < topLeft.x) topLeft.x = vertex.x;
            if (vertex.y > topLeft.y) topLeft.y = vertex.y;
        }

        return new AABB(this.scaledSize, topLeft);
    }
    public async update(gameTime: GameTime): Promise<void> {
        this.normals = this.computeNormals(this.vertices);
        this.scaledSize = this.computeSize(this.vertices);
        this._aabb = this.computeAABB();
    }
}
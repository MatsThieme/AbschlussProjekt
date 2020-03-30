import { PolygonCollider } from '../../GameObject/Components/PolygonCollider.js';
import { PolygonRenderer } from '../../GameObject/Components/PolygonRenderer.js';
import { GameObject } from '../../GameObject/GameObject.js';
import { PhysicsMaterial } from '../../Physics/PhysicsMaterial.js';
import { Vector2 } from '../../Vector2.js';

export function RightPrefab(gameObject: GameObject): void {
    gameObject.addComponent(PolygonCollider, polygonCollider => {
        polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(1, 0), new Vector2(0, 1)];
    });

    gameObject.transform.relativePosition = new Vector2(8, 0);
    gameObject.transform.relativeScale = new Vector2(0.5, 9);
    gameObject.addComponent(PolygonRenderer);
}
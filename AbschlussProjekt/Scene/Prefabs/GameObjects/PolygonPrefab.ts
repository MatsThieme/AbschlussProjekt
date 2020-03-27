import { PolygonCollider } from '../../GameObject/Components/PolygonCollider.js';
import { PolygonRenderer } from '../../GameObject/Components/PolygonRenderer.js';
import { GameObject } from '../../GameObject/GameObject.js';
import { PhysicsMaterial } from '../../Physics/PhysicsMaterial.js';
import { Vector2 } from '../../Vector2.js';
import { ReloadPage } from '../../GameObject/Behaviours/ReloadPage.js';

export function PolygonPrefab(gameObject: GameObject): void {
    gameObject.addComponent(PolygonCollider, polygonCollider => {
        polygonCollider.vertices = [new Vector2(-1, 0.2), new Vector2(1.5, 1), new Vector2(1, 1.1), new Vector2(0.5, 1), new Vector2(1, 0)];
        //polygonCollider.density = 10;
    });

    gameObject.transform.relativePosition = new Vector2(-0.3, 2);
    gameObject.rigidbody.useAutoMass = true;
    gameObject.addComponent(PolygonRenderer);
    gameObject.addComponent(ReloadPage);
}
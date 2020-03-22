import { Move } from '../../GameObject/Behaviours/Move.js';
import { ReloadPage } from '../../GameObject/Behaviours/ReloadPage.js';
import { PolygonCollider } from '../../GameObject/Components/PolygonCollider.js';
import { PolygonRenderer } from '../../GameObject/Components/PolygonRenderer.js';
import { GameObject } from '../../GameObject/GameObject.js';
import { PhysicsMaterial } from '../../Physics/PhysicsMaterial.js';
import { Vector2 } from '../../Vector2.js';

export function PlayerPrefab(gameObject: GameObject): void {
    gameObject.addComponent(PolygonCollider, polygonCollider => {
        polygonCollider.vertices = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1), new Vector2(1, 0), new Vector2(0.5, -0.5)];
        polygonCollider.material = new PhysicsMaterial(0, 1, 1);
    });

    gameObject.transform.relativePosition = new Vector2(0, 0);
    gameObject.rigidbody.useAutoMass = true;
    gameObject.addComponent(PolygonRenderer);
    gameObject.addComponent(Move);
    //gameObject.addComponent(ReloadPage);
}
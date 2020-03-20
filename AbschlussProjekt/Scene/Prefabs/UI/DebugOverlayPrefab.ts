import { AABB } from '../../Physics/AABB.js';
import { UIText } from '../../UI/UIElements/UIText.js';
import { UIFontSize } from '../../UI/UIFontSize.js';
import { UIMenu } from '../../UI/UIMenu.js';
import { Vector2 } from '../../Vector2.js';

export function DebugOverlayPrefab(menu: UIMenu): void {
    menu.aabb = new AABB(new Vector2(1920, 1080), new Vector2());
    menu.active = true;
    menu.pauseScene = false;
    menu.addUIElement(UIText, (text, scene) => {
        text.aabb = new AABB(new Vector2(100, 50), new Vector2(0, 0));
        text.fontSize = UIFontSize.Small;
        setInterval(() => text.label = scene.framedata.fps.toString(), 500);
    });
}
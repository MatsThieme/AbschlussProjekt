import { AlignH, AlignV } from '../../../GameObject/Align.js';
import { AABB } from '../../../Physics/AABB.js';
import { UIButton } from '../../../UI/UIElements/UIButton.js';
import { UIDropdown } from '../../../UI/UIElements/UIDropdown.js';
import { UIFontSize } from '../../../UI/UIFontSize.js';
import { UIMenu } from '../../../UI/UIMenu.js';
import { Vector2 } from '../../../Vector2.js';

export function MainMenuPrefab(menu: UIMenu): void {
    menu.aabb = new AABB(new Vector2(1920, 1080), new Vector2());
    menu.active = true;
    menu.addUIElement(UIButton, button => {
        button.aabb = new AABB(new Vector2(200, 120), new Vector2());
        button.localAlignH = AlignH.Center;
        button.localAlignV = AlignV.Center;
        button.alignH = AlignH.Center;
        button.alignV = AlignV.Center;
        button.cbOnInput = b => { menu.active = !menu.active; };
        button.label = 'play';
        button.fontSize = UIFontSize.Large;
    });

    //menu.addUIElement(UICheckbox, checkbox => {
    //    checkbox.label = 'check';
    //    checkbox.cbOnInput = c => console.log(c.checked);
    //    checkbox.aabb = new AABB(new Vector2(50, 50), new Vector2(200, 200));
    //});

    menu.addUIElement(UIDropdown, dropdown => {
        dropdown.aabb = new AABB(new Vector2(200, 150), new Vector2(0, 100));
        dropdown.values = ['first', 'second', 'third'];
        dropdown.cbOnInput = d => console.log(d.value);
        dropdown.fitText(1.2);
    });
}
import { GameObject } from '../../GameObject/GameObject.js';
import { TileMap } from '../../GameObject/Components/TileMap.js';
import { Vector2 } from '../../Vector2.js';

export function TestTileMapPrefab(gameObject: GameObject) {
    gameObject.addComponent(TileMap, tileMap => {
        const size = new Vector2(10, 5);
        const map: string[][] = [];

        for (let y = 0; y < size.y; y++) {
            map[y] = [];
            for (let x = 0; x < size.x; x++) {
                if (y > 3) map[y][x] = 'spriteTest1.png';
                else map[y][x] = '';
            }
        }

        tileMap.tileMap = map;

        console.log(tileMap.collisionMap);
    });
}
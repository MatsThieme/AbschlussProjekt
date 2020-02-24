"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameObject_js_1 = require("./GameObject.js");
const BoxCollider_js_1 = require("./Components/BoxCollider.js");
const test = new GameObject_js_1.GameObject('test');
test.transform.position.x = 10;
test.transform.position.y = 5;
const boxCollider = test.addComponent(BoxCollider_js_1.BoxCollider);
console.log(boxCollider.gameObject.transform.gameObject.transform.gameObject.name);
console.log(boxCollider.position);
process.stdin.resume();
//# sourceMappingURL=Main.js.map
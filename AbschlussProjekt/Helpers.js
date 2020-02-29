//export function reduce(f: Vector2): Vector2 {
//    for (let i = f.x; i > 0; i--) {
//        if (f.x % i === 0 && f.y % i === 0) {
//            return new Vector2((f.x / i), (f.y / i));
//        }
//    }
//    return f;
//}
export var clamp = function (min, max, val) { return val < min ? min : val > max ? max : val; };

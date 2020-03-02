import { BoxCollider } from '../Components/BoxCollider.js';
import { CapsuleCollider } from '../Components/CapsuleCollider.js';
import { CircleCollider } from '../Components/CircleCollider.js';
import { ComponentType } from '../Components/ComponentType.js';
import { GameObject } from '../GameObject.js';
import { clamp } from '../Helpers.js';
import { Vector2 } from '../Vector2.js';
import { AsyncWorker } from '../Worker/AsyncWorker.js';
import { AABB } from './AABB.js';
import { Collider } from './Collider.js';
import { Collision } from './Collision.js';

export class Physics {
    public static gravity: Vector2 = new Vector2(0, 9.807 / 1000);
    public static timeScale: number = 1;
    public static async  asyncCollision(first: GameObject, second: GameObject): Promise<Collision[]> {
        //return await AsyncWorker.work('Physics/PhysicsWorker.js', { name: 'collision', parameters: [first, second] });
        return Physics.collision(first, second);
    }
    public static collision(first: GameObject, second: GameObject): Collision[] {
        const ret: Collision[] = [];

        if (first.id === second.id) return ret;

        for (const collider of first.getComponents<Collider>(ComponentType.Collider)) {

            if (collider.type === ComponentType.CircleCollider) {

                for (const otherCollider of second.getComponents<Collider>(ComponentType.Collider)) {
                    if (!AABB.intersects(collider, otherCollider)) continue;

                    if (otherCollider.type === ComponentType.CircleCollider) {
                        const c = Physics.collisionCircle(<CircleCollider>collider, <CircleCollider>otherCollider);
                        if (c.normal) ret.push(c);
                    } else if (otherCollider.type === ComponentType.BoxCollider) {
                        const c = Physics.collisionBoxCircle(<BoxCollider>otherCollider, <CircleCollider>collider);
                        if (c.normal) ret.push(c);
                    } else if (otherCollider.type === ComponentType.CapsuleCollider) {
                        const c = Physics.collisionCapsuleCircle(<CapsuleCollider>otherCollider, <CircleCollider>collider);
                        ret.push(...c);
                    }
                }

            } else if (collider.type === ComponentType.BoxCollider) {

                for (const otherCollider of second.getComponents<Collider>(ComponentType.Collider)) {
                    if (!AABB.intersects(collider, otherCollider)) continue;

                    if (otherCollider.type === ComponentType.CircleCollider) {
                        const c = Physics.collisionBoxCircle(<BoxCollider>collider, <CircleCollider>otherCollider);
                        if (c.normal) ret.push(c);
                    } else if (otherCollider.type === ComponentType.BoxCollider) {
                        const c = Physics.collisionBox(<BoxCollider>collider, <BoxCollider>otherCollider);
                        if (c.normal) ret.push(c);
                    } else if (otherCollider.type === ComponentType.CapsuleCollider) {
                        const c = Physics.collisionCapsuleBox(<CapsuleCollider>otherCollider, <BoxCollider>collider);
                        ret.push(...c);
                    }
                }

            } else if (collider.type === ComponentType.CapsuleCollider) {

                for (const otherCollider of second.getComponents<Collider>(ComponentType.Collider)) {
                    if (!AABB.intersects(collider, otherCollider)) continue;

                    if (otherCollider.type === ComponentType.CircleCollider) {
                        const c = Physics.collisionCapsuleCircle(<CapsuleCollider>collider, <CircleCollider>otherCollider);
                        ret.push(...c);
                    } else if (otherCollider.type === ComponentType.BoxCollider) {
                        const c = Physics.collisionCapsuleBox(<CapsuleCollider>collider, <BoxCollider>otherCollider);
                        ret.push(...c);
                    } else if (otherCollider.type === ComponentType.CapsuleCollider) {
                        const c = Physics.collisionCapsule(<CapsuleCollider>collider, <CapsuleCollider>otherCollider);
                        ret.push(...c);
                    }
                }

            }
        }

        return ret;
    }
    public static intersectsCircle(circleCollider1: CircleCollider, circleCollider2: CircleCollider): boolean {
        return circleCollider2.gameObject.transform.position.sub(circleCollider1.gameObject.transform.position).magnitudeSquared < (circleCollider1.radius + circleCollider2.radius) ** 2;
    }
    public static collisionCircle(circleCollider1: CircleCollider, circleCollider2: CircleCollider): Collision {
        const gO1 = circleCollider1.gameObject;
        const gO2 = circleCollider2.gameObject;

        if (!Physics.intersectsCircle(circleCollider1, circleCollider2)) return new Collision(gO1, gO2);

        let penetration: number;
        let normal: Vector2;

        const AtoB = gO2.transform.position.sub(gO1.transform.position);

        if (AtoB.magnitude != 0) {
            penetration = circleCollider1.radius + circleCollider2.radius - AtoB.magnitude;
            normal = AtoB.normalized; // test with gos swapped
        } else {
            penetration = Math.max(circleCollider1.radius, circleCollider2.radius);
            normal = new Vector2(0, 1);
        }

        return new Collision(gO1, gO2, normal, penetration);
    }
    public static collisionBox(boxCollider1: BoxCollider, boxCollider2: BoxCollider): Collision {
        const gO1 = boxCollider1.gameObject;
        const gO2 = boxCollider2.gameObject;

        let penetration: number;
        let normal: Vector2;

        const AtoB = gO2.transform.position.sub(gO1.transform.position);

        const x_overlap = boxCollider1.AABB.size.x / 2 + boxCollider1.AABB.size.x / 2 - Math.abs(AtoB.x);
        const y_overlap = boxCollider2.AABB.size.y / 2 + boxCollider2.AABB.size.y / 2 - Math.abs(AtoB.y);

        if (x_overlap > y_overlap) {
            normal = new Vector2(0, AtoB.x < 0 ? -1 : 1);
            penetration = x_overlap;
        } else {
            normal = new Vector2(0, AtoB.y < 0 ? -1 : 1);
            penetration = y_overlap;
        }

        return new Collision(gO1, gO2, normal, penetration);
    }
    public static collisionBoxCircle(boxCollider: BoxCollider, circleCollider: CircleCollider): Collision {
        const gO1 = boxCollider.gameObject;
        const gO2 = circleCollider.gameObject;

        let penetration: number = 0;
        let normal: Vector2 = new Vector2();

        const AtoB = gO2.transform.position.sub(gO1.transform.position);

        let closest = AtoB;

        const x_extent = boxCollider.AABB.size.y / 2;
        const y_extent = boxCollider.AABB.size.y / 2;

        closest.x = clamp(-x_extent, x_extent, closest.x);
        closest.y = clamp(-y_extent, y_extent, closest.y);

        let inside = false;

        if (closest == AtoB) {
            inside = true;

            if (Math.abs(AtoB.x) > Math.abs(AtoB.y)) {
                if (closest.x > 0) closest.x = x_extent;
                else closest.x = -x_extent;
            } else {
                if (closest.y > 0) closest.y = y_extent;
                else closest.y = -y_extent;
            }
        }

        normal = AtoB.sub(closest);

        let d = normal.magnitude;
        const r = circleCollider.radius;

        if (d > r && !inside) return new Collision(gO1, gO2);

        if (inside) {
            normal = AtoB.scale(-1);
            penetration = r - d;
        } else {
            normal = AtoB;
            penetration = r - d;
        }

        return new Collision(gO1, gO2, normal, penetration);
    }
    public static collisionCapsule(capsuleCollider1: CapsuleCollider, capsuleCollider2: CapsuleCollider): Collision[] {
        return [...Physics.collisionCapsuleBox(capsuleCollider1, capsuleCollider2.boxCollider), ...Physics.collisionCapsuleCircle(capsuleCollider1, capsuleCollider2.circleColliderTop), ...Physics.collisionCapsuleCircle(capsuleCollider1, capsuleCollider2.circleColliderBottom)];
    }
    public static collisionCapsuleBox(capsuleCollider: CapsuleCollider, boxCollider: BoxCollider): Collision[] {
        const ret: Collision[] = [];

        const boxtop = Physics.collisionBoxCircle(boxCollider, capsuleCollider.circleColliderTop);
        if (boxtop.normal) ret.push(boxtop);
        const boxbox = Physics.collisionBox(boxCollider, capsuleCollider.boxCollider);
        if (boxbox.normal) ret.push(boxbox);
        const boxbot = Physics.collisionBoxCircle(boxCollider, capsuleCollider.circleColliderBottom);
        if (boxbot.normal) ret.push(boxbot);

        return ret;
    }
    public static collisionCapsuleCircle(capsuleCollider: CapsuleCollider, circleCollider: CircleCollider): Collision[] {
        const ret: Collision[] = [];

        const circletop = Physics.collisionCircle(circleCollider, capsuleCollider.circleColliderTop);
        if (circletop.normal) ret.push(circletop);
        const circlebox = Physics.collisionBoxCircle(capsuleCollider.boxCollider, circleCollider);
        if (circlebox.normal) ret.push(circlebox);
        const circlebot = Physics.collisionCircle(circleCollider, capsuleCollider.circleColliderBottom);
        if (circlebot.normal) ret.push(circlebot);

        return ret;
    }
}
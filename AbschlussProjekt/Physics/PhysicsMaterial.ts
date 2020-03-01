export class PhysicsMaterial {
    public bounciness: number;
    public friction: number;
    public constructor(bounce: number = 1, friction: number = 1) {
        this.bounciness = bounce;
        this.friction = friction;
    }
}
export class PhysicsMaterial {
    public bounciness: number;
    public friction: number;
    public constructor(bounciness: number = 1, friction: number = 1) {
        this.bounciness = bounciness;
        this.friction = friction;
    }
}
import { Clamp } from "./MathExtensions";

export class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public static Dot(a: Vector3, b: Vector3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    public static Mul(a: Vector3, s: number) {
        return new Vector3(a.x * s, a.y * s, a.z * s);
    }

    public Length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public Normalize(): Vector3 {
        let len = this.Length();
        if (len === 0) len = 0.000_000_1;
        const inv = 1 / this.Length();
        return Vector3.Mul(this, inv);
    }

    public static SphereDistance(
        a: Vector3,
        b: Vector3,
        radius: number
    ): number {
        return (
            Math.acos(Clamp(Vector3.Dot(a.Normalize(), b.Normalize()), 0, 1)) *
            radius
        );
    }
}

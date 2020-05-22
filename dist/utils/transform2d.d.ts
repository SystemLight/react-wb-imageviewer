interface relativeFunc<T, P> {
    (val: T): P;
}
export declare class Transform2D {
    el: HTMLElement;
    matchMatrix: RegExp;
    matchTranslate: RegExp;
    matchScale: RegExp;
    matchRotate: RegExp;
    matchSkew: RegExp;
    constructor(el: HTMLElement);
    radian2angle(radian: number): number;
    angle2radian(angle: number): number;
    reset(): this;
    origin(): number[];
    setOrigin(x: number | string, y: number | string): void;
    transform(): string;
    setTransform(result: RegExpMatchArray | null, val: string): this;
    getMatrix(): number[];
    setMatrix(matrix?: Array<number>): this;
    getTranslate(): [number, number, RegExpMatchArray | null];
    setTranslate(x?: number, y?: number, relative?: boolean): this;
    getScale(): [number, RegExpMatchArray | null];
    setScale(sca?: number, relative?: number | relativeFunc<Array<number>, number>): this;
    getRotate(): [number, RegExpMatchArray | null];
    setRotate(angle?: number, relative?: boolean): this;
    getSkew(): [number, number, RegExpMatchArray | null];
    setSkew(xAngle?: number, yAngle?: number, relative?: boolean): this;
}
export {};

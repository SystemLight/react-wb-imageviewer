declare type eve = "tap" | "doubleTap" | "longTap" | "pressMove" | "pinch" | "tapDown" | "tapMove" | "tapUp";
declare type eveCallback = (e: ExtendTouchEvent) => void;
declare type point = {
    x: number;
    y: number;
};
declare type move = point & {
    d: number;
};
interface ExtendTouchEvent extends TouchEvent {
    [key: string]: any;
}
export declare class TouchGesture {
    el: HTMLElement;
    private eventPool;
    private touchLength;
    private startPoint;
    private startPoint2;
    private startMiddlePoint;
    private lastMovePoint;
    private lastTapEndPoint;
    private startSpace;
    private startAngle;
    private lastDoubleTime;
    private longTimer;
    private moveFlag;
    constructor(el: HTMLElement);
    private _initEve;
    private _touchstart;
    private _touchmove;
    private _touchend;
    private _tapDown;
    private _tapMove;
    private _tapUp;
    private _tap;
    private _doubleTap;
    private _longTap;
    private _pressMove;
    private _pinch;
    on(eve: eve, eveCallback: eveCallback): void;
    off(eve: eve, eveCallback: eveCallback): void;
    destroy(): void;
    interval(lastTime: number, duration?: number): Promise<unknown>;
    getMove(p1: point, p2: point): move;
    getAngle(move: move): number;
    getMiddlePoint(p1: point, p2: point): {
        x: number;
        y: number;
    };
    radian2angle(radian: number): number;
    angle2radian(angle: number): number;
}
export {};

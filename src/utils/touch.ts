type eve = "tap" | "doubleTap" | "longTap" | "pressMove" | "pinch" | "tapDown" | "tapMove" | "tapUp";
type eveCallback = (e: ExtendTouchEvent) => void;
type eventPool = Record<eve, Array<eveCallback>>;

type point = {
    x: number,
    y: number
};

type move = point & {
    d: number
}

interface ExtendTouchEvent extends TouchEvent {
    [key: string]: any;
}

export class TouchGesture {

    private eventPool: eventPool = {
        "tap": [],
        "doubleTap": [],
        "longTap": [],
        "pressMove": [],
        "pinch": [],
        "tapDown": [],
        "tapMove": [],
        "tapUp": [],
    };
    private touchLength: number = 0;

    private startPoint: point = {x: 0, y: 0};
    private startPoint2: point = {x: 0, y: 0};
    private lastMovePoint: point = {x: 0, y: 0};
    private lastTapEndPoint: point = {x: 0, y: 0};

    private startSpace: move = {x: 0, y: 0, d: 0};
    private startAngle: number = 0;

    private lastDoubleTime: number = 0;
    private longTimer = 0;

    private moveFlag: boolean = false;


    constructor(public el: HTMLElement) {
        this.el.style.touchAction = "none";
        this._initEve();
    }

    private _initEve() {
        this.el.addEventListener("touchstart", this._touchstart);
        this.el.addEventListener("touchmove", this._tapMove);
        this.el.addEventListener("touchend", this._tapUp);

        document.addEventListener("touchmove", this._touchmove);
        document.addEventListener("touchend", this._touchend);
    }

    private _touchstart = (e: TouchEvent) => {
        this._tapDown(e);
        if (e.targetTouches.length === 1) {
            // 按下且只有一根手指
            this.touchLength = 1;
            this.startPoint = {x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY};
            this.lastMovePoint = this.startPoint;
            this.longTimer = window.setTimeout(() => {
                this._longTap(e);
            }, 1000);
        } else if (e.targetTouches.length === 2) {
            // 按下且只有两根手指
            this.startPoint2 = {x: e.targetTouches[1].clientX, y: e.targetTouches[1].clientY};
            this.startSpace = this.getMove(this.startPoint, this.startPoint2);
            this.startAngle = this.getAngle(this.startSpace);
            this.touchLength = this.startSpace.d < 5 ? 0 : 2;
        }
    }

    private _touchmove = (e: TouchEvent) => {
        clearTimeout(this.longTimer);
        let nowPoint: point = {x: e.touches[0].clientX, y: e.touches[0].clientY};
        if (this.touchLength === 1) {
            // 按下且只有一根手指
            let moveDistance = this.getMove(nowPoint, this.lastMovePoint);
            let startDistance = this.getMove(nowPoint, this.startPoint);
            this._pressMove({...e, moveDistance, startDistance});
            this.lastMovePoint = nowPoint;
            this.moveFlag = true;
        } else if (this.touchLength === 2) {
            // 按下且只有两根手指
            let twoPoint: point = {x: e.touches[1].clientX, y: e.touches[1].clientY};
            let pointSpace = this.getMove(nowPoint, twoPoint);
            let pointAngle = this.getAngle(pointSpace);
            let scale = pointSpace.d / this.startSpace.d;

            this._pinch({
                ...e,
                pointAngle,
                startAngle: this.startAngle,
                pointSpace,
                startSpace: this.startSpace,
                scale,
                rotate: this.radian2angle(pointAngle - this.startAngle)
            });
        }
    }

    private _touchend = (e: TouchEvent) => {
        clearTimeout(this.longTimer);
        let tapEndPoint: point = {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY};
        if (this.touchLength === 1) {
            // 按下且只有一根手指

            if (!this.moveFlag) {
                this._tap(e);
            }

            let lastTapEndPoint = this.lastTapEndPoint;
            this.interval(this.lastDoubleTime).then(() => {
                if (this.getMove(tapEndPoint, lastTapEndPoint).d < 30) {
                    this._doubleTap(e);
                }
                this.lastDoubleTime = 0;
                this.lastTapEndPoint = {x: 0, y: 0};
            }).catch((nowTime) => {
                this.lastDoubleTime = nowTime;
            });

            this.lastTapEndPoint = tapEndPoint;
        } else if (this.touchLength === 2) {
            // 按下且只有两根手指
        }

        this.touchLength = 0;
        this.moveFlag = false;
    }

    private _tapDown = (e: ExtendTouchEvent) => {
        this.eventPool["tapDown"].forEach((callback) => {
            callback(e);
        });
    }

    private _tapMove = (e: ExtendTouchEvent) => {
        this.eventPool["tapMove"].forEach((callback) => {
            callback(e);
        });
    }

    private _tapUp = (e: ExtendTouchEvent) => {
        this.eventPool["tapUp"].forEach((callback) => {
            callback(e);
        });
    }

    private _tap(e: ExtendTouchEvent) {
        this.eventPool["tap"].forEach((callback) => {
            callback(e);
        });
    }

    private _doubleTap(e: ExtendTouchEvent) {
        this.eventPool["doubleTap"].forEach((callback) => {
            callback(e);
        });
    }

    private _longTap(e: ExtendTouchEvent) {
        this.eventPool["longTap"].forEach((callback) => {
            callback(e);
        });
    }

    private _pressMove(e: ExtendTouchEvent) {
        this.eventPool["pressMove"].forEach((callback) => {
            callback(e);
        });
    }

    private _pinch(e: ExtendTouchEvent) {
        this.eventPool["pinch"].forEach((callback) => {
            callback(e);
        });
    }

    on(eve: eve, eveCallback: eveCallback) {
        this.eventPool[eve].push(eveCallback);
    }

    off(eve: eve, eveCallback: eveCallback) {
        this.eventPool[eve] = this.eventPool[eve].filter(function (v) {
            return v != eveCallback;
        });
    }

    destroy() {
        this.el.removeEventListener("touchstart", this._touchstart);
        this.el.removeEventListener("touchmove", this._tapMove);
        this.el.removeEventListener("touchend", this._tapUp);

        document.removeEventListener("touchmove", this._touchmove);
        document.removeEventListener("touchend", this._touchend);
    }

    public interval(lastTime: number, duration: number = 500) {
        // 判定当前时间是否和给定的时间间隔符合期望值
        return new Promise((resolve, reject) => {
            let nowTime = new Date().getTime();
            if (nowTime - lastTime < duration) {
                resolve(nowTime);
            } else {
                reject(nowTime);
            }
        });
    }

    public getMove(p1: point, p2: point): move {
        return {x: p1.x - p2.x, y: p1.y - p2.y, d: Math.hypot(p1.x - p2.x, p1.y - p2.y)};
    }

    public getAngle(move: move) {
        let {x, y} = move;
        return Math.atan2(y, x);
    }

    public radian2angle(radian: number) {
        return radian * 180 / Math.PI;
    }

    public angle2radian(angle: number) {
        return angle * Math.PI / 180;
    }
}
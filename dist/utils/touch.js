export class TouchGesture {
    el;
    eventPool = {
        'tap': [],
        'doubleTap': [],
        'longTap': [],
        'pressMove': [],
        'pinch': [],
        'tapDown': [],
        'tapMove': [],
        'tapUp': []
    };
    touchLength = 0;
    startPoint = { x: 0, y: 0 };
    startPoint2 = { x: 0, y: 0 };
    startMiddlePoint = { x: 0, y: 0 };
    lastMovePoint = { x: 0, y: 0 };
    lastTapEndPoint = { x: 0, y: 0 };
    startSpace = { x: 0, y: 0, d: 0 };
    startAngle = 0;
    lastDoubleTime = 0;
    longTimer = 0;
    moveFlag = false;
    constructor(el) {
        this.el = el;
        this.el.style.touchAction = 'none';
        this._initEve();
    }
    _initEve() {
        this.el.addEventListener('touchstart', this._touchstart);
        this.el.addEventListener('touchmove', this._tapMove);
        this.el.addEventListener('touchend', this._tapUp);
        document.addEventListener('touchmove', this._touchmove);
        document.addEventListener('touchend', this._touchend);
    }
    _touchstart = (e) => {
        if (e.targetTouches.length === 1) {
            // 按下且只有一根手指
            this.touchLength = 1;
            this.startPoint = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
            this.lastMovePoint = this.startPoint;
            this.longTimer = window.setTimeout(() => {
                this._longTap(e);
            }, 1000);
        }
        else if (e.targetTouches.length === 2) {
            // 按下且只有两根手指
            this.startPoint2 = { x: e.targetTouches[1].clientX, y: e.targetTouches[1].clientY };
            this.startSpace = this.getMove(this.startPoint, this.startPoint2);
            this.startAngle = this.getAngle(this.startSpace);
            this.startMiddlePoint = this.getMiddlePoint(this.startPoint, this.startPoint2);
            this.touchLength = this.startSpace.d < 5 ? 0 : 2;
        }
        e.startMiddlePoint = this.startMiddlePoint;
        e.touchLength = this.touchLength;
        this._tapDown(e);
    };
    _touchmove = (e) => {
        clearTimeout(this.longTimer);
        const nowPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        if (this.touchLength === 1) {
            // 按下且只有一根手指
            const moveDistance = this.getMove(nowPoint, this.lastMovePoint);
            const startDistance = this.getMove(nowPoint, this.startPoint);
            e.moveDistance = moveDistance;
            e.startDistance = startDistance;
            this._pressMove(e);
            this.lastMovePoint = nowPoint;
            this.moveFlag = true;
        }
        else if (this.touchLength === 2) {
            // 按下且只有两根手指
            const twoPoint = { x: e.touches[1].clientX, y: e.touches[1].clientY };
            const pointSpace = this.getMove(nowPoint, twoPoint);
            const pointAngle = this.getAngle(pointSpace);
            const scale = pointSpace.d / this.startSpace.d;
            e.startMiddlePoint = this.startMiddlePoint;
            e.pointAngle = pointAngle;
            e.startAngle = this.startAngle;
            e.pointSpace = pointSpace;
            e.startSpace = this.startSpace;
            e.scale = scale;
            e.rotate = this.radian2angle(pointAngle - this.startAngle);
            this._pinch(e);
        }
    };
    _touchend = (e) => {
        clearTimeout(this.longTimer);
        const tapEndPoint = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        if (this.touchLength === 1) {
            // 按下且只有一根手指
            if (!this.moveFlag) {
                this._tap(e);
            }
            const lastTapEndPoint = this.lastTapEndPoint;
            this.interval(this.lastDoubleTime).then(() => {
                if (this.getMove(tapEndPoint, lastTapEndPoint).d < 30) {
                    this._doubleTap(e);
                }
                this.lastDoubleTime = 0;
                this.lastTapEndPoint = { x: 0, y: 0 };
            }).catch((nowTime) => {
                this.lastDoubleTime = nowTime;
            });
            this.lastTapEndPoint = tapEndPoint;
        }
        else if (this.touchLength === 2) {
            // 按下且只有两根手指
        }
        this.touchLength = 0;
        this.moveFlag = false;
    };
    _tapDown = (e) => {
        this.eventPool['tapDown'].forEach((callback) => {
            callback(e);
        });
    };
    _tapMove = (e) => {
        this.eventPool['tapMove'].forEach((callback) => {
            callback(e);
        });
    };
    _tapUp = (e) => {
        this.eventPool['tapUp'].forEach((callback) => {
            callback(e);
        });
    };
    _tap(e) {
        this.eventPool['tap'].forEach((callback) => {
            callback(e);
        });
    }
    _doubleTap(e) {
        this.eventPool['doubleTap'].forEach((callback) => {
            callback(e);
        });
    }
    _longTap(e) {
        this.eventPool['longTap'].forEach((callback) => {
            callback(e);
        });
    }
    _pressMove(e) {
        this.eventPool['pressMove'].forEach((callback) => {
            callback(e);
        });
    }
    _pinch(e) {
        this.eventPool['pinch'].forEach((callback) => {
            callback(e);
        });
    }
    on(eve, eveCallback) {
        this.eventPool[eve].push(eveCallback);
    }
    off(eve, eveCallback) {
        this.eventPool[eve] = this.eventPool[eve].filter(function (v) {
            return v != eveCallback;
        });
    }
    destroy() {
        this.el.removeEventListener('touchstart', this._touchstart);
        this.el.removeEventListener('touchmove', this._tapMove);
        this.el.removeEventListener('touchend', this._tapUp);
        document.removeEventListener('touchmove', this._touchmove);
        document.removeEventListener('touchend', this._touchend);
    }
    interval(lastTime, duration = 500) {
        // 判定当前时间是否和给定的时间间隔符合期望值
        return new Promise((resolve, reject) => {
            const nowTime = new Date().getTime();
            if (nowTime - lastTime < duration) {
                resolve(nowTime);
            }
            else {
                reject(nowTime);
            }
        });
    }
    getMove(p1, p2) {
        return { x: p1.x - p2.x, y: p1.y - p2.y, d: Math.hypot(p1.x - p2.x, p1.y - p2.y) };
    }
    getAngle(move) {
        const { x, y } = move;
        return Math.atan2(y, x);
    }
    getMiddlePoint(p1, p2) {
        return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    }
    radian2angle(radian) {
        return radian * 180 / Math.PI;
    }
    angle2radian(angle) {
        return angle * Math.PI / 180;
    }
}
//# sourceMappingURL=touch.js.map
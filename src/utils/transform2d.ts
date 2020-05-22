interface relativeFunc<T, P> {
    (val: T): P
}


function acc(val: number) {
    return val.toFixed(2);
}


export class Transform2D {

    public matchMatrix = /matrix\((.*?)\)/;
    public matchTranslate = /translate\((-?[\d\\.]*)px *, *(-?[\d\\.]*)px\)/;
    public matchScale = /scale\((-?[\d\\.]*)\)/;
    public matchRotate = /rotate\((-?[\d\\.]*)deg\)/;
    public matchSkew = /skew\((-?[\d\\.]*)deg *, *(-?[\d\\.]*)deg\)/;

    constructor(public el: HTMLElement) {
    }

    radian2angle(radian: number) {
        return radian * 180 / Math.PI;
    }

    angle2radian(angle: number) {
        return angle * Math.PI / 180;
    }

    reset() {
        this.el.style.transform = "";
        return this;
    }

    origin() {
        return this.el.style.transformOrigin.replace("px", "").split(" ").map(Number);
    }

    setOrigin(x: number | string, y: number | string) {
        x = typeof x === "number" ? x + "px" : x;
        y = typeof y === "number" ? y + "px" : y;
        this.el.style.transformOrigin = `${x} ${y}`;
    }

    transform() {
        return this.el.style.transform;
    }

    setTransform(result: RegExpMatchArray | null, val: string) {
        if (result) {
            this.el.style.transform = this.el.style.transform.replace(result[0], val);
        } else {
            this.el.style.transform += val;
        }
        return this;
    }

    getMatrix() {
        let result = this.transform().match(this.matchMatrix);
        if (result) {
            return [...result[1].split(",")].map(value => Number(value));
        } else {
            return [1, 0, 0, 1, 0, 0];
        }
    }

    setMatrix(matrix: Array<number> = [1, 0, 0, 1, 0, 0]) {
        let newMatrix = matrix.map(acc);
        return this.setTransform(this.transform().match(this.matchMatrix), ` matrix(${matrix.join(",")}) `);
    }

    getTranslate(): [number, number, RegExpMatchArray | null] {
        let result = this.transform().match(this.matchTranslate);
        if (result) {
            return [Number(result[1]), Number(result[2]), result];
        } else {
            return [0, 0, null];
        }
    }

    setTranslate(x: number = 0, y: number = 0, relative: boolean = false) {
        let result = this.getTranslate();
        if (relative) {
            x += result[0];
            y += result[1];
        }
        return this.setTransform(result[2], ` translate(${acc(x)}px,${acc(y)}px) `);
    }

    getScale(): [number, RegExpMatchArray | null] {
        let result = this.transform().match(this.matchScale);
        if (result) {
            return [Number(result[1]), result];
        } else {
            return [1, null];
        }
    }

    setScale(sca: number = 1, relative: number | relativeFunc<Array<number>, number> = 1) {
        let result = this.getScale();
        if (typeof relative === "number") {
            sca *= relative;
        } else {
            sca = relative([result[0], sca]);
        }
        return this.setTransform(result[1], ` scale(${acc(sca)}) `);
    }

    getRotate(): [number, RegExpMatchArray | null] {
        let result = this.transform().match(this.matchRotate);
        if (result) {
            return [Number(result[1]), result];
        } else {
            return [0, null];
        }
    }

    setRotate(angle: number = 0, relative: boolean = false) {
        let result = this.getRotate();
        if (relative) {
            angle += result[0];
        }
        return this.setTransform(result[1], ` rotate(${acc(angle)}deg) `);
    }

    getSkew(): [number, number, RegExpMatchArray | null] {
        let result = this.transform().match(this.matchSkew);
        if (result) {
            return [Number(result[1]), Number(result[2]), result];
        } else {
            return [0, 0, null];
        }
    }

    setSkew(xAngle: number = 0, yAngle: number = 0, relative: boolean = false) {
        let result = this.getSkew();
        if (relative) {
            xAngle += result[0];
            yAngle += result[1];
        }
        return this.setTransform(result[2], ` skew(${acc(xAngle)}deg,${acc(yAngle)}deg) `);
    }
}
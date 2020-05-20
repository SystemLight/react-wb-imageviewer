export class Transform2D {

    public matchMatrix = /matrix\((.*?)\)/;
    public matchTranslate = /translate\((-?[\d\\.]*)px,(-?[\d\\.]*)px\)/;
    public matchScale = /scale\((-?[\d\\.]*)\)/;
    public matchRotate = /rotate\((-?[\d\\.]*)deg\)/;
    public matchSkew = /skew\((-?[\d\\.]*)deg,(-?[\d\\.]*)deg\)/;

    constructor(public el: HTMLElement) {
    }

    radian2angle(radian: number) {
        return radian * 180 / Math.PI;
    }

    angle2radian(angle: number) {
        return angle * Math.PI / 180;
    }

    transform() {
        return this.el.style.transform.replace(/ /g, "");
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

    setMatrix(matrix: Array<number>) {
        return this.setTransform(this.transform().match(this.matchMatrix), ` matrix(${matrix.join(",")}) `);
    }

    getTranslate() {
        let result = this.transform().match(this.matchTranslate);
        if (result) {
            return [result[1], result[2]];
        } else {
            return [0, 0];
        }
    }

    setTranslate(x: number, y: number) {
        return this.setTransform(this.transform().match(this.matchTranslate), ` translate(${x}px,${y}px) `);
    }

    getScale() {
        let result = this.transform().match(this.matchScale);
        if (result) {
            return [result[1]];
        } else {
            return [0];
        }
    }

    setScale(sca: number) {
        return this.setTransform(this.transform().match(this.matchScale), ` scale(${sca}) `);
    }

    getRotate() {
        let result = this.transform().match(this.matchRotate);
        if (result) {
            return [result[1]];
        } else {
            return [0];
        }
    }

    setRotate(angle: number) {
        return this.setTransform(this.transform().match(this.matchRotate), ` rotate(${angle}deg) `);
    }

    getSkew() {
        let result = this.transform().match(this.matchSkew);
        if (result) {
            return [result[1], result[2]];
        } else {
            return [0, 0];
        }
    }

    setSkew(xAngle: number, yAngle: number = 0) {
        return this.setTransform(this.transform().match(this.matchSkew), ` skew(${xAngle}deg,${yAngle}deg) `);
    }
}
function acc(val) {
    return val.toFixed(2);
}
export class Transform2D {
    el;
    matchMatrix = /matrix\((.*?)\)/;
    matchTranslate = /translate\((-?[\d\\.]*)px *, *(-?[\d\\.]*)px\)/;
    matchScale = /scale\((-?[\d\\.]*)\)/;
    matchRotate = /rotate\((-?[\d\\.]*)deg\)/;
    matchSkew = /skew\((-?[\d\\.]*)deg *, *(-?[\d\\.]*)deg\)/;
    constructor(el) {
        this.el = el;
    }
    radian2angle(radian) {
        return radian * 180 / Math.PI;
    }
    angle2radian(angle) {
        return angle * Math.PI / 180;
    }
    reset() {
        this.el.style.transform = '';
        return this;
    }
    origin() {
        return this.el.style.transformOrigin.replace('px', '').split(' ').map(Number);
    }
    setOrigin(x, y) {
        x = typeof x === 'number' ? x + 'px' : x;
        y = typeof y === 'number' ? y + 'px' : y;
        this.el.style.transformOrigin = `${x} ${y}`;
    }
    transform() {
        return this.el.style.transform;
    }
    setTransform(result, val) {
        if (result) {
            this.el.style.transform = this.el.style.transform.replace(result[0], val);
        }
        else {
            this.el.style.transform += val;
        }
        return this;
    }
    getMatrix() {
        const result = this.transform().match(this.matchMatrix);
        if (result) {
            return [...result[1].split(',')].map((value) => Number(value));
        }
        else {
            return [1, 0, 0, 1, 0, 0];
        }
    }
    setMatrix(matrix = [1, 0, 0, 1, 0, 0]) {
        const newMatrix = matrix.map(acc);
        return this.setTransform(this.transform().match(this.matchMatrix), ` matrix(${newMatrix.join(',')}) `);
    }
    getTranslate() {
        const result = this.transform().match(this.matchTranslate);
        if (result) {
            return [Number(result[1]), Number(result[2]), result];
        }
        else {
            return [0, 0, null];
        }
    }
    setTranslate(x = 0, y = 0, relative = false) {
        const result = this.getTranslate();
        if (relative) {
            x += result[0];
            y += result[1];
        }
        return this.setTransform(result[2], ` translate(${acc(x)}px,${acc(y)}px) `);
    }
    getScale() {
        const result = this.transform().match(this.matchScale);
        if (result) {
            return [Number(result[1]), result];
        }
        else {
            return [1, null];
        }
    }
    setScale(sca = 1, relative = 1) {
        const result = this.getScale();
        if (typeof relative === 'number') {
            sca *= relative;
        }
        else {
            sca = relative([result[0], sca]);
        }
        return this.setTransform(result[1], ` scale(${acc(sca)}) `);
    }
    getRotate() {
        const result = this.transform().match(this.matchRotate);
        if (result) {
            return [Number(result[1]), result];
        }
        else {
            return [0, null];
        }
    }
    setRotate(angle = 0, relative = false) {
        const result = this.getRotate();
        if (relative) {
            angle += result[0];
        }
        return this.setTransform(result[1], ` rotate(${acc(angle)}deg) `);
    }
    getSkew() {
        const result = this.transform().match(this.matchSkew);
        if (result) {
            return [Number(result[1]), Number(result[2]), result];
        }
        else {
            return [0, 0, null];
        }
    }
    setSkew(xAngle = 0, yAngle = 0, relative = false) {
        const result = this.getSkew();
        if (relative) {
            xAngle += result[0];
            yAngle += result[1];
        }
        return this.setTransform(result[2], ` skew(${acc(xAngle)}deg,${acc(yAngle)}deg) `);
    }
}
//# sourceMappingURL=transform2d.js.map
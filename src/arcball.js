import {
    vecDot,
    vecNorm,
    vecSub,
    vecLen,
    vecCross,
    vecLenSq,
    mat3Mul,
    mat3Transpose,
    mat3Invert,
    rotAaMat3,
    BAR,
} from './util.js';

class ArcBall {
    #callback;
    #width = 0;
    #height = 0;
    #matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    #lastRotationAxis;
    #lastTimestamp = 0;
    #lastVelocity = 0;
    #lastRequest = 0;
    #lastX;
    #lastY;

    constructor(matrix, callback) {
        this.scale = 1;
        this.#matrix = matrix ? [...matrix] : this.#matrix;
        this.#callback = callback;
    }

    #stopRunningAnimation() {
        if (this.#lastRequest) {
            window.cancelAnimationFrame(this.#lastRequest);
            this.#lastRequest = 0;
        }
    }

    setViewportSize(width, height) {
        this.#width = width;
        this.#height = height;
    }

    start([x, y]) {
        this.#lastX = x;
        this.#lastY = y;
        this.#lastVelocity = 0;
        this.#stopRunningAnimation();
    }

    end(eventTimestamp) {
        if (!this.#callback) return;

        if (eventTimestamp - this.#lastTimestamp > 40) return;

        if (this.#lastVelocity < 0.0001) return;

        let lastTimestamp = 0;

        const mat = [...this.#matrix];
        let angle = 0;

        const tick = (timestamp) => {
            if (this.#lastVelocity < 0.0001) return;

            if (lastTimestamp) {
                let dt = timestamp - lastTimestamp;

                while (dt-- > 0) {
                    angle += this.#lastVelocity;
                    this.#lastVelocity *= 0.995;
                }
            }

            lastTimestamp = timestamp;

            this.#matrix = mat3Mul(rotAaMat3(this.#lastRotationAxis, angle), mat);

            this.#callback();

            this.#lastRequest = window.requestAnimationFrame(tick);
        };

        this.#lastRequest = window.requestAnimationFrame(tick);
    }

    #vec(x, y) {
        const speed = 0.5 * 1.3;
        const size = Math.min(this.#width, this.#height) * speed;
        const p = [(x - this.#width / 2) / size, (y - this.#height / 2) / size, 0];
        // p[0] = -p[0];
        // p[1] = -p[1];

        const d = p[0] * p[0] + p[1] * p[1];
        if (d <= 0.5) {
            p[2] = Math.sqrt(1 - d);
        } else {
            p[2] = 1 / (2 * Math.sqrt(d));
        }

        return p;
    }

    update([x, y], timestamp) {
        if (x == this.#lastX && y == this.#lastY) return;

        const va = this.#vec(this.#lastX, this.#lastY);
        const vb = this.#vec(x, y);

        let angle = Math.acos(Math.min(1.0, vecDot(vecNorm(va), vecNorm(vb))));
        angle = Math.max(angle, vecLen(vecSub(vb, va)));

        const axis = vecNorm(vecCross(va, vb));
        const axisLen = vecLenSq(axis);
        const dt = timestamp - this.#lastTimestamp;

        if (Number.isFinite(angle) && Number.isFinite(axisLen) && dt != 0) {
            this.#matrix = mat3Mul(rotAaMat3(axis, angle), this.#matrix);

            this.#lastRotationAxis = vecNorm(vecCross(va, vb));
            this.#lastVelocity = (0.8 * angle) / dt;
        }

        this.#lastTimestamp = timestamp;
        this.#lastX = x;
        this.#lastY = y;
    }

    get matrix() {
        return this.#matrix;
    }

    set matrix(mat) {
        this.#matrix = [...mat];
        this.#lastVelocity = 0;
        this.#stopRunningAnimation();
    }

    destory() {
        this.#callback = null;
        this.matrix = [];
    }
}

const touchHandler = function (target, { begin, move, end, wheel }) {
    const ctrl = new AbortController();
    const signal = ctrl.signal;

    target.addEventListener('mousedown', mouseDown, { capture: false, signal });

    function mouseDown(e) {
        window.addEventListener('mousemove', mouseMove, { capture: false, signal });
        window.addEventListener('mouseup', mouseUp, { capture: false, signal });

        const res = begin ? begin(e) : true;

        if (res && e.preventDefault) e.preventDefault();
        return res;
    }

    function mouseMove(e) {
        return move ? move(e) : true;
    }

    function mouseUp(e) {
        window.removeEventListener('mousemove', mouseMove, { capture: false, signal });
        window.removeEventListener('mouseup', mouseUp, { capture: false, signal });

        return end ? end(e) : true;
    }

    target.addEventListener('touchstart', touchDown, { capture: false, signal });

    let identifier;

    function touchDown(e) {
        if (!identifier) {
            window.addEventListener('touchmove', touchMove, { capture: false, signal });
            window.addEventListener('touchend', touchEnd, { capture: false, signal });
            window.addEventListener('touchcancel', touchEnd, { capture: false, signal });
            const touch = e.changedTouches[0];

            identifier = touch.identifier;
            touch.timeStamp = e.timeStamp;

            const res = begin ? begin(touch) : true;

            if (res && e.preventDefault) e.preventDefault();
            return res;
        }
        return false;
    }

    function touchMove(e) {
        if (!move) return true;

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];

            if (touch.identifier == identifier) {
                touch.timeStamp = e.timeStamp;

                return move(touch);
            }
        }
    }

    function touchEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];

            if (touch.identifier == identifier) {
                touch.timeStamp = e.timeStamp;

                identifier = undefined;

                window.removeEventListener('touchmove', touchMove, {
                    capture: false,
                    signal,
                });
                window.removeEventListener('touchend', touchEnd, {
                    capture: false,
                    signal,
                });
                window.removeEventListener('touchcancel', touchEnd, {
                    capture: false,
                    signal,
                });
                return end ? end(touch) : true;
            }
        }

        return true;
    }

    target.addEventListener('wheel', wheelHandler, { passive: false });

    function wheelHandler(e) {
        const res = wheel ? wheel(e) : true;

        if (res && e.preventDefault) e.preventDefault();
        return res;
    }

    return () => {
        // destory
        signal?.abort();
    };
};

export { ArcBall, touchHandler };

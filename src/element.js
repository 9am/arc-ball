import { ArcBall, touchHandler } from './arcball.js';

class Ball extends HTMLElement {
    #ball = null;
    #arcball = null;
    #touchHandler = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.append(this.#getTemplate());
        this.#ball = this.shadowRoot.querySelector('#ball');
    }

    #getTemplate() {
        const tmp = document.createElement('template');
        tmp.innerHTML = `
            <style>
                *,
                *::before,
                *::after {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                :host {
                    display: grid;
                    place-content: center;
                    cursor: grab;
                }
                :host(:active) {
                    cursor: grabbing;
                }
                #ball {
                    position: relative;
                    grid-area: 1 / 1;
                    transform-style: preserve-3d;
                    transform: var(--scale3d, scale(1)) var(--matrix3d, matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1));
                }
            </style>
            <div id="ball" part="ball"><slot></slot></div>
        `;
        return tmp.content.cloneNode(true);
    }

    #getPoint(e) {
        const { top, left, width, height } = this.getBoundingClientRect();
        const size = Math.min(width, height);
        this.#arcball.setViewportSize(size, size);
        return [e.clientX - left, e.clientY - top];
    }

    repaint(matrix) {
        const [a1, a2, a3, b1, b2, b3, c1, c2, c3] = matrix;
        this.#ball.style.setProperty(
            '--matrix3d',
            `matrix3d(${[a1, b1, c1]},0,${[a2, b2, c2]},0,${[a3, b3, c3]},0,0,0,0,1)`
        );
    }

    connectedCallback() {
        this.#arcball = new ArcBall(null, () => {
            this.repaint(this.#arcball.matrix);
        });
        this.#touchHandler = touchHandler(this, {
            begin: (e) => {
                this.#arcball.start(this.#getPoint(e));
                return true;
            },
            move: (e) => {
                this.#arcball.update(this.#getPoint(e), e.timeStamp);
                this.repaint(this.#arcball.matrix);
                return true;
            },
            end: (e) => {
                this.#arcball.end(e.timeStamp);
            },
            wheel: (e) => {
                let scale = this.#arcball.scale;
                scale += e.deltaY * -0.001;
                scale = Math.min(Math.max(0.25, scale), 4);
                this.#ball.style.setProperty(
                    '--scale3d',
                    `scale3d(${scale},${scale},${scale})`
                );
                this.#arcball.scale = scale;
                return true;
            },
        });
    }

    disconnectedCallback() {
        this.#arcball.destory && this.#arcball.destory();
        this.#touchHandler ?? this.#touchHandler();
        this.#arcball = null;
        this.#touchHandler = null;
    }
}

class BallAxis extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.append(this.#getTemplate());
    }

    #getTemplate() {
        const tmp = document.createElement('template');
        tmp.innerHTML = `
            <style>
                *,
                *::before,
                *::after {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                :host {
                    --r: 5px;
                    --len: 200px;
                    display: block;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    transform-style: preserve-3d;
                    font-size: calc(var(--r) * 2);
                }
                ol {
                    --r-h: calc(var(--r) / 2);
                    position: relative;
                    width: var(--len);
                    height: var(--r);
                    transform-style: preserve-3d;
                    list-style: none;
                }
                li,
                li::before,
                li::after,
                i,
                i::before,
                i::after {
                    content: '';
                    display: block;
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--color);
                    transform-style: preserve-3d;
                    backface-visibility: visible;
                }
                i,
                li {
                    --rotate: rotateX(0);
                    --x: calc(var(--len) / 2);
                    --y: 0px;
                    --z: 0px;
                    --dx: 0px;
                    --dy: 0px;
                    --dz: 0px;
                    transform-origin: left center;
                    transform: translate3d(calc(var(--x) + var(--dx)), calc(var(--y) + var(--dy)), calc(var(--z) + var(--dz))) var(--rotate);
                    text-align: right;
                    line-height: var(--r);
                    background: unset;
                }
                i {
                    transform: rotateX(90deg);
                }
                i::before,
                li::before {
                    transform: translateZ(calc(-1 * var(--r-h)));
                }
                i::after,
                li::after {
                    transform: translateZ(calc(1 * var(--r-h)));
                }
                li#x {
                    --color: rgba(255 0 0 / .2);
                    --rotate: rotateX(0);
                    --dx: calc(-1 * var(--r-h));
                }
                li#y {
                    --color: rgba(0 255 0 / .2);
                    --rotate: rotateY(90deg);
                    --dz: calc(1 * var(--r-h));
                }
                li#z {
                    --color: rgba(0 0 255 / .2);
                    --rotate: rotateZ(90deg);
                    --dy: calc(-1 * var(--r-h));
                }
            </style>
            <ol>
                <li id="x"><i>X</i></li>
                <li id="y"><i>Y</i></li>
                <li id="z"><i>Z</i></li>
            </ol>
        `;
        return tmp.content.cloneNode(true);
    }

    connectedCallback() {}

    disconnectedCallback() {}
}

if (window && !window.customElements.get('arc-ball-axis')) {
    window.customElements.define('arc-ball-axis', BallAxis);
}

if (window && !window.customElements.get('arc-ball')) {
    window.customElements.define('arc-ball', Ball);
}

export { Ball, BallAxis };

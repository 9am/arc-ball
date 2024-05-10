import { ArcBall, touchHandler } from './arcball.js';
import { createObject } from './stl.js';

class Ball extends HTMLElement {
    #ball = null;
    #arcball = null;
    #touchHandler = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const css = new CSSStyleSheet();
        css.replaceSync(this.#getCSS());
        this.shadowRoot.adoptedStyleSheets = [css];
        this.shadowRoot.append(this.#getTemplate());
        this.#ball = this.shadowRoot.querySelector('#ball');
    }

    #getCSS() {
        return `
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
                transform: var(--scale3d, scale(1)) var(--rotate3d, rotate(0));
            }
        `;
    }

    #getTemplate() {
        const tmp = document.createElement('template');
        tmp.innerHTML = `
            <div id="ball" part="ball"><slot></slot></div><slot name="escape"></slot>
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
        this.style.setProperty(
            '--rotate3d',
            `matrix3d(${[a1, b1, c1]},0,${[a2, b2, c2]},0,${[a3, b3, c3]},0,0,0,0,1)`
        );
        this.style.setProperty(
            '--rotate3d-transpose',
            `matrix3d(${[a1, a2, a3]},0,${[b1, b2, b3]},0,${[c1, c2, c3]},0,0,0,0,1)`
        );
        this.dispatchEvent(new CustomEvent('UPDATE', { detail: { matrix } }));
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
                scale = Math.min(Math.max(0.2, scale), 4);
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
        const css = new CSSStyleSheet();
        css.replaceSync(this.#getCSS());
        this.shadowRoot.adoptedStyleSheets = [css];
        this.shadowRoot.append(this.#getTemplate());
    }

    #getCSS() {
        return `
            *,
            *::before,
            *::after {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            :host {
                --size-label: 20px;
                --r: 2px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transform-style: preserve-3d;
                width: var(--size, 200px);
                aspect-ratio: 1;
                display: grid;
                place-content: center;
                justify-content: stretch;
                padding: calc(var(--size-label) / 2) !important;
            }
            ol {
                --r-h: calc(var(--r) / 2);
                position: relative;
                width: 100%;
                height: var(--r);
                transform-style: preserve-3d;
                list-style: none;
                color: white;
            }
            li,
            li::before,
            li::after,
            i,
            i::before,
            i::after {
                --stop: calc(50% - var(--r-h));
                content: '';
                display: block;
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(to right, transparent var(--stop), var(--color) var(--stop));
                transform-style: preserve-3d;
                backface-visibility: visible;
            }
            i,
            li {
                transform: var(--rotate, rotateX(0));
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
                --color: hsl(10deg 60% 50%);
            }
            li#y {
                --color: hsl(100deg 60% 50%);
                --rotate: rotateZ(90deg);
            }
            li#z {
                --color: hsl(210deg 60% 50%);
                --rotate: rotateY(-90deg);
            }

            code {
                --reset-translate: translate(-50%, -50%);
                position: absolute;
                top: 50%;
                transform: var(--reset-translate) var(--reset-rotation) var(--rotate3d-transpose, rotate(0));

                display: block;
                width: var(--size-label);
                line-height: var(--size-label);
                aspect-ratio: 1;
                border-radius: 50%;
                outline: 2px solid white;
                text-align: center;
                font-size: calc(var(--size-label) / 1.5);
                background: var(--color);
                opacity: 0.3;
            }
            code:last-child {
                --reset-translate: translate(50%, -50%);
                right: 0;
                opacity: 1;
            }
            li#x code {
                --reset-rotation: rotateX(0);
            }
            li#y code {
                --reset-rotation: rotateZ(-90deg);
            }
            li#z code {
                --reset-rotation: rotateY(90deg);
            }
        `;
    }

    #getTemplate() {
        const tmp = document.createElement('template');
        tmp.innerHTML = `
            <ol>
                <li id="x"><code>-X</code><i></i><code>X</code></li>
                <li id="y"><code>-Y</code><i></i><code>Y</code></li>
                <li id="z"><code>-Z</code><i></i><code>Z</code></li>
            </ol>
        `;
        return tmp.content.cloneNode(true);
    }

    connectedCallback() {}

    disconnectedCallback() {}
}

class BallSTL extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const css = new CSSStyleSheet();
        css.replaceSync(this.#getCSS());
        this.shadowRoot.adoptedStyleSheets = [css];
        this.shadowRoot.append(this.#getTemplate());
    }

    #getCSS() {
        return `
            *,
            *::before,
            *::after {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            :host {
                display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transform-style: preserve-3d;
            }
            .tri {
                display: block;
                width: var(--w, 10px);
                height: var(--h, 10px);
                position: absolute;
                top: 0;
                left: 0;
                backface-visibility: hidden;
                transform-origin: var(--originX) 0 0;
                transform: translateX(calc(var(--originX) * -1)) var(--matrix3d);
                clip-path: var(--clip, unset);
                transform-style: preserve-3d;
                background: hsl(0 0% calc(var(--light) * 100%) / 1);
            }
        `;
    }

    #getTemplate() {
        const tmp = document.createElement('template');
        tmp.innerHTML = ``;
        return tmp.content.cloneNode(true);
    }

    install(stl = []) {
        this.shadowRoot.replaceChildren(createObject(stl));
    }

    uninstall() {
        this.shadowRoot.replaceChildren();
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

if (window && !window.customElements.get('arc-ball-stl')) {
    window.customElements.define('arc-ball-stl', BallSTL);
}

export { Ball, BallAxis, BallSTL };

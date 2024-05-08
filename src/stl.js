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
    AXIS_X,
    AXIS_Y,
    AXIS_Z,
    AXIS_ALL,
    MAT3_I,
    BAR,
} from './util.js';

const LIGHT = vecNorm([-1, 1, -1]);

const rotMat3FromTo = (a, b) => {
    let axis = vecNorm(vecCross(a, b));
    const dot = vecDot(a, b);
    let angle = Math.acos(dot);
    if (!Number.isFinite(vecLenSq(axis))) {
        console.info('same direction');
        if (1 - dot < BAR) {
            console.info('identical');
            return MAT3_I;
        }
        const target = AXIS_ALL.find((nor) => Math.abs(vecDot(a, nor)) !== 1);
        axis = vecNorm(vecCross(a, target));
        angle = Math.PI;
    }
    return rotAaMat3(axis, angle);
};

const trans = (p, m) => {
    /* 0 1 2
     * 3 4 5
     * 6 7 8
     */
    const res = new Array(3);

    res[0] = p[0] * m[0] + p[1] * m[1] + p[2] * m[2];
    res[1] = p[0] * m[3] + p[1] * m[4] + p[2] * m[5];
    res[2] = p[0] * m[6] + p[1] * m[7] + p[2] * m[8];

    return res;
};

const toXY = (before, normal) => {
    const [b0, b1, b2] = before;
    const nor = normal ?? vecNorm(vecCross(vecSub(b1, b0), vecSub(b2, b0)));
    // align nor to AXIS_Z
    let mat1 = rotMat3FromTo(nor, AXIS_Z);

    const next = before.map((point) => {
        return trans(point, mat1);
    });

    // align l0_1 to AXIS_X
    const [n0, n1] = next;
    const l0_1 = vecNorm(vecSub(n1, n0));
    const mat2 = rotMat3FromTo(l0_1, AXIS_X);

    let mat = mat3Mul(mat2, mat1);
    let after = before.map((p) => trans(p, mat));

    // p2.x < 0
    if (after[2][1] < -1 * BAR) {
        mat = mat3Mul(rotAaMat3(AXIS_X, Math.PI), mat);
        after = before.map((p) => trans(p, mat));
    }

    return [mat, after, nor];
};

const invert = (root, mat3) => {
    const [rx, ry, rz] = root;
    const invertMat3 = mat3Transpose(mat3Invert(mat3));
    return [
        ...invertMat3.slice(0, 3),
        0,
        ...invertMat3.slice(3, 6),
        0,
        ...invertMat3.slice(6, 9),
        0,
        rx,
        ry,
        rz,
        1,
    ];
};

export const createTriangle = (points = [], normal, debug = false) => {
    // move root to 0
    const [root] = points;
    const [rx, ry, rz] = root;
    const rootPoints = points.map((p) => {
        const [x, y, z] = p;
        return [x - rx, y - ry, z - rz];
    });

    const [toXYMat3, xyPoints, nor] = toXY(rootPoints, normal);
    const invertMat4 = invert(root, toXYMat3);

    const [p, p1, p2] = xyPoints;
    const [p1x, p1y] = p1;
    const [p2x, p2y] = p2;

    const w = Math.max(p1x, p2x, p1x - p2x);
    const h = Math.max(p2y, p2y);
    let c0x = 0;
    let c1x = (p1x * 100) / w;
    let c2x = (p2x * 100) / w;
    // deal with picking the Obtuse-angled root
    if (p2x < -1 * BAR) {
        c0x = (1 - p1x / w) * 100;
        c1x = 100;
        c2x = 0;
    }
    const clip = `polygon(${c0x}% 0, ${c1x}% 0, ${c2x}% 100%)`;

    if (debug) {
        document.querySelectorAll('.dot').forEach((dot, i) => {
            const [x, y, z] = xyPoints[i];
            dot.style.setProperty('--position', `translate3d(${x}px, ${y}px, ${z}px)`);
        });
    }

    // light
    const light = Math.acos(vecDot(nor, LIGHT)) / Math.PI;

    /* triangle surface */
    const tri = document.createElement('i');
    tri.className = 'tri';
    tri.style.setProperty('--w', `${w}px`);
    tri.style.setProperty('--h', `${h}px`);
    tri.style.setProperty('--clip', `${clip}`);
    tri.style.setProperty('--originX', `${c0x}%`);
    tri.style.setProperty('--matrix3d', `matrix3d(${invertMat4})`);
    tri.style.setProperty('--light', `${light}`);
    return tri;
};

export const createObject = (surfaces = []) => {
    const frag = document.createDocumentFragment();
    const len = surfaces.length;
    for (let i = 0; i < len; i += 1) {
        const { v, n } = surfaces[i];
        frag.appendChild(createTriangle(v));
    }
    return frag;
};

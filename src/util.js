export const AXIS_X = [1, 0, 0];
export const AXIS_Y = [0, 1, 0];
export const AXIS_Z = [0, 0, 1];
export const AXIS_ALL = [AXIS_X, AXIS_Y, AXIS_Z];
export const MAT3_I = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export const BAR = 1e-7;

export const mat3Invert = (a) => {
    let a00 = a[0],
        a01 = a[1],
        a02 = a[2];
    let a10 = a[3],
        a11 = a[4],
        a12 = a[5];
    let a20 = a[6],
        a21 = a[7],
        a22 = a[8];
    let b01 = a22 * a11 - a12 * a21;
    let b11 = -a22 * a10 + a12 * a20;
    let b21 = a21 * a10 - a11 * a20;
    let det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) {
        return null;
    }
    det = 1.0 / det;
    const res = new Array(9);
    res[0] = b01 * det;
    res[1] = (-a22 * a01 + a02 * a21) * det;
    res[2] = (a12 * a01 - a02 * a11) * det;
    res[3] = b11 * det;
    res[4] = (a22 * a00 - a02 * a20) * det;
    res[5] = (-a12 * a00 + a02 * a10) * det;
    res[6] = b21 * det;
    res[7] = (-a21 * a00 + a01 * a20) * det;
    res[8] = (a11 * a00 - a01 * a10) * det;
    return res;
};

export const mat3Transpose = (mat) => {
    const res = new Array(9);
    res[0] = mat[0];
    res[1] = mat[3];
    res[2] = mat[6];
    res[3] = mat[1];
    res[4] = mat[4];
    res[5] = mat[7];
    res[6] = mat[2];
    res[7] = mat[5];
    res[8] = mat[8];
    return res;
};

export const mat3Mul = (a, b) => {
    const res = new Array(9);
    res[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
    res[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
    res[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];

    res[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
    res[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
    res[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];

    res[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
    res[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
    res[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

    return res;
};

// Rodrigues' rotation formula
//
// V(rot) = I + sin(a) . K + (1 - cos(a)) . K^2
//
// I = [
//  1 0 0
//  0 1 0
//  0 0 1
// ]
//
// K = [
//  0  -z  y
//  z   0  x
//  -y  x  0
// ]
export const rotAaMat3 = (axis, angle) => {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    const x = axis[0];
    const y = axis[1];
    const z = axis[2];

    return [
        x * x * (1 - c) + c,
        x * y * (1 - c) - z * s,
        x * z * (1 - c) + y * s,

        y * x * (1 - c) + z * s,
        y * y * (1 - c) + c,
        y * z * (1 - c) - x * s,

        z * x * (1 - c) - y * s,
        z * y * (1 - c) + x * s,
        z * z * (1 - c) + c,
    ];
};

export const vecLenSq = (a) => {
    return vecDot(a, a);
};

export const vecCross = (a, b) => {
    return [
        a[1] * b[2] - a[2] * b[1],
        -a[0] * b[2] + a[2] * b[0],
        a[0] * b[1] - a[1] * b[0],
    ];
};

export const vecDot = (a, b) => {
    let r = 0;
    for (let i = 0; i < a.length; i++) r += a[i] * b[i];
    return r;
};

export const vecSub = (a, b) => {
    const r = new Array(a.length);
    for (let i = 0; i < a.length; i++) r[i] = a[i] - b[i];
    return r;
};
export const vecNorm = (a) => {
    let d = 0;
    for (let i = 0; i < a.length; i++) d += a[i] * a[i];

    d = 1.0 / Math.sqrt(d);
    const r = new Array(a.length);
    if (d < BAR) {
        r.fill(0);
        return r;
    }

    for (let i = 0; i < a.length; i++) r[i] = a[i] * d;
    return r;
};
export const vecLen = (a) => {
    let d = 0;
    for (let i = 0; i < a.length; i++) d += a[i] * a[i];

    return Math.sqrt(d);
};

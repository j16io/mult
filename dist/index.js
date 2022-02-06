"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearRegression = exports.determinant = exports.inverse = exports.solve = exports.LUPDecompose = exports.transpose = exports.dot = exports.Matrix = void 0;
var Matrix = /** @class */ (function () {
    /**
     * Initialize array from 2d array.
     * @param matrix 2d array
     * @param copy whether to copy the array or not. If copy is false, changing the initial array will change the Matrix.
     */
    function Matrix(matrix, copy) {
        if (copy === void 0) { copy = false; }
        if (copy) {
            this.matrix = copyArray(matrix);
        }
        else {
            this.matrix = matrix;
        }
        this.rows = matrix.length;
        this.columns = matrix[0].length;
        this.defineProperties();
    }
    /**
     * Shorthand for new Matrix()
     * @param matrix 2d array
     * @param copy whether to copy the array or not.
     */
    Matrix.from = function (matrix, copy) {
        if (copy === void 0) { copy = false; }
        return new Matrix(matrix, copy);
    };
    /**
     * Initialize empty matrix
     * @param columns number of columns
     * @param rows number of rows
     */
    Matrix.empty = function (rows, columns) {
        if (columns === void 0) { columns = undefined; }
        if (columns === undefined) {
            return new Matrix(this.emptyMatrix(rows, rows));
        }
        else {
            return new Matrix(this.emptyMatrix(rows, columns));
        }
    };
    /**
     * Initialize matrix of zeros
     * @param columns number of columns
     * @param rows number of rows
     */
    Matrix.zeros = function (rows, columns) {
        if (columns === void 0) { columns = undefined; }
        if (columns === undefined) {
            return new Matrix(this.emptyMatrix(rows, rows, 0));
        }
        else {
            return new Matrix(this.emptyMatrix(rows, columns, 0));
        }
    };
    /**
     * Initialize matrix of ones
     * @param columns number of columns
     * @param rows number of rows
     */
    Matrix.ones = function (rows, columns) {
        if (columns === void 0) { columns = undefined; }
        if (columns === undefined) {
            return new Matrix(this.emptyMatrix(rows, rows, 1));
        }
        else {
            return new Matrix(this.emptyMatrix(rows, columns, 1));
        }
    };
    /**
     * Initialize identity matrix
     * @param dimension
     */
    Matrix.identity = function (dimension) {
        return new Matrix(this.emptyMatrix(dimension, dimension, 0, true));
    };
    /**
     * Initialize a matrix and fill it with a number
     * @param columns number of columns
     * @param rows number of rows
     * @param fill number to fill
     */
    Matrix.fill = function (rows, columns, fill) {
        return new Matrix(this.emptyMatrix(rows, columns, fill));
    };
    Matrix.prototype.defineProperties = function () {
        var _this = this;
        Object.defineProperty(this, 'T', {
            get: function () {
                return new Matrix(transpose(_this.toArray()), true);
            }
        });
        for (var j = 0; j < this.columns; ++j) {
            Object.defineProperty(this, j, {
                value: this.matrix[j]
            });
        }
    };
    Matrix.emptyMatrix = function (rows, columns, fill, identity) {
        if (fill === void 0) { fill = undefined; }
        if (identity === void 0) { identity = false; }
        var matrix = new Array(rows);
        var identity_index = 0;
        for (var j = 0; j < rows; j++) {
            matrix[j] = new Array(columns);
            if (typeof fill === 'number') {
                matrix[j].fill(fill);
            }
            if (identity) {
                matrix[j][identity_index] = 1;
                identity_index += 1;
            }
        }
        return matrix;
    };
    Matrix.prototype.dot = function (otherMatrix) {
        return new Matrix(dot(this.matrix, otherMatrix.matrix));
    };
    Matrix.prototype.transpose = function () {
        return new Matrix(transpose(this.toArray()));
    };
    Matrix.prototype.inv = function () {
        return new Matrix(inverse(this.toArray()));
    };
    Matrix.prototype.det = function () {
        return determinant(this.toArray());
    };
    Matrix.prototype.size = function () {
        return [this.rows, this.columns];
    };
    Matrix.prototype.copy = function () {
        return new Matrix(copyArray(this.toArray()));
    };
    Matrix.prototype.toArray = function () {
        return this.matrix;
    };
    Matrix.prototype.toString = function () {
        return this.matrix.map(function (row) { return "[".concat(row.join(','), "]"); }).join('\n');
    };
    return Matrix;
}());
exports.Matrix = Matrix;
/**
 * Multiply to matrices
 * @param a Matrix a
 * @param b Matrix b
 */
function dot(a, b) {
    var _a = [a.length, a[0].length], a_y = _a[0], a_x = _a[1];
    var _b = [b.length, b[0].length], b_y = _b[0], b_x = _b[1];
    if (a_x !== b_y) {
        throw new Error("Cannot multiply ".concat(a_y, "x").concat(a_x, " matrix with ").concat(b_y, "x").concat(b_x, " matrix"));
    }
    var _c = [a_y, b_x], c_y = _c[0], c_x = _c[1];
    var result = new Array(c_y);
    for (var c_j = 0; c_j < c_y; c_j++) {
        var row = new Array(c_x);
        for (var c_i = 0; c_i < c_x; c_i++) {
            var sum = 0;
            for (var j = 0; j < a_x; j++) {
                sum += a[c_j][j] * b[j][c_i];
            }
            row[c_i] = sum;
        }
        result[c_j] = row;
    }
    return result;
}
exports.dot = dot;
function transpose(matrix) {
    var _a = [matrix.length, matrix[0].length], c_j = _a[0], c_i = _a[1];
    var result = new Array(c_i);
    for (var j = 0; j < c_i; j++) {
        result[j] = new Array(c_j);
        for (var i = 0; i < c_j; i++) {
            result[j][i] = matrix[i][j];
        }
    }
    return result;
}
exports.transpose = transpose;
function copyArray(matrix) {
    var _a = [matrix.length, matrix[0].length], n = _a[0], m = _a[1];
    var result = new Array(n);
    for (var j = 0; j < n; j++) {
        result[j] = new Array(m);
        for (var i = 0; i < m; i++) {
            result[j][i] = matrix[j][i];
        }
    }
    return result;
}
/**
 * Append vector to matrix
 * @param matrix
 * @param vector
 * @param axis
 * @param inplace
 */
function append(matrix, vector, axis, inplace) {
    if (axis === void 0) { axis = 0; }
    if (inplace === void 0) { inplace = false; }
    if (axis === 0) {
        var result = void 0;
        if (inplace) {
            result = copyArray(matrix);
        }
        else {
            result = matrix;
        }
        result.push(vector);
        return result;
    }
    else {
        var result = transpose(copyArray(matrix));
        result.push(vector);
        return transpose(result);
    }
}
/**
 * Prepend vector to matrix
 * @param matrix
 * @param vector
 * @param axis
 * @param inplace
 */
function prepend(matrix, vector, axis, inplace) {
    if (axis === void 0) { axis = 0; }
    if (inplace === void 0) { inplace = false; }
    if (axis === 0) {
        var result = void 0;
        if (inplace) {
            result = copyArray(matrix);
        }
        else {
            result = matrix;
        }
        result.unshift(vector);
        return result;
    }
    else {
        var result = transpose(copyArray(matrix));
        result.unshift(vector);
        return transpose(result);
    }
}
/**
 * LU factorization with partial pivoting
 * @param matrix
 * @param tolerance
 * @return [A: number[][], P: number[]]: Matrix A contains a copy of both matrices L-E and U as A=(L-E)+U
 * such that P*A=L*U. P containing indices where permutation matrix is 1.
 */
function LUPDecompose(matrix, tolerance) {
    if (tolerance === void 0) { tolerance = 0.000001; }
    var _a = typeof matrix === typeof Matrix ? matrix.size() : [matrix[0].length, matrix.length], n = _a[0], m = _a[1];
    if (n !== m)
        throw new Error("Matrix is not square");
    var A = copyArray((typeof matrix === typeof Matrix ? matrix.toArray() : matrix));
    // Initialize permutation matrix
    var P = new Array(n + 1);
    for (var i = 0; i <= n; i++) {
        P[i] = i;
    }
    var maxIndex;
    var maxValue;
    for (var i = 0; i < n; i++) {
        maxValue = 0.0;
        maxIndex = i;
        for (var k = i; k < n; k++) {
            var absA = Math.abs(matrix[k][i]);
            if (absA > maxValue) {
                maxValue = absA;
                maxIndex = k;
            }
        }
        if (maxValue < tolerance)
            throw new Error("Matrix is degenerate");
        if (maxIndex != i) {
            var j = P[i];
            P[i] = P[maxIndex];
            P[maxIndex] = j;
            var partial = A[i];
            A[i] = A[maxIndex];
            A[maxIndex] = partial;
            P[n]++;
        }
        for (var j = i + 1; j < n; j++) {
            A[j][i] /= A[i][i];
            for (var k = i + 1; k < n; k++) {
                A[j][k] -= A[j][i] * A[i][k];
            }
        }
    }
    return [A, P];
}
exports.LUPDecompose = LUPDecompose;
/**
 * Solve system of linear equations using LU decomposition.
 * @param matrix
 * @param b
 * @param precision
 * @return x: Solution to Mx=b
 */
function solve(matrix, b, precision) {
    if (precision === void 0) { precision = 10; }
    var _a = LUPDecompose(matrix), A = _a[0], P = _a[1];
    var N = A.length;
    var x = new Array(N);
    var precision_constant = Math.pow(10, precision);
    for (var i = 0; i < N; i++) {
        x[i] = b[P[i]];
        for (var k = 0; k < i; k++) {
            x[i] -= A[i][k] * x[k];
        }
    }
    for (var i = N - 1; i >= 0; i--) {
        for (var k = i + 1; k < N; k++) {
            x[i] -= A[i][k] * x[k];
        }
        x[i] /= A[i][i];
        x[i] = Math.round((x[i] + Number.EPSILON) * precision_constant) / precision_constant;
    }
    return x;
}
exports.solve = solve;
/**
 * Calculate inverse of matrix
 * @param matrix
 * @param precision
 * @return inverse: The inverse of the matrix
 */
function inverse(matrix, precision) {
    if (precision === void 0) { precision = 10; }
    if (precision < 0 || precision > 15)
        throw new Error("Precision must be a number between 1 and 15");
    var _a = LUPDecompose(matrix), A = _a[0], P = _a[1];
    var N = A.length;
    var inverse = new Array(N);
    var precision_constant = Math.pow(10, precision);
    for (var j = 0; j < N; j++) {
        inverse[j] = new Array(N);
    }
    for (var j = 0; j < N; j++) {
        for (var i = 0; i < N; i++) {
            inverse[i][j] = P[i] == j ? 1.0 : 0.0;
            for (var k = 0; k < i; k++) {
                inverse[i][j] -= A[i][k] * inverse[k][j];
            }
        }
        for (var i = N - 1; i >= 0; i--) {
            for (var k = i + 1; k < N; k++) {
                inverse[i][j] -= A[i][k] * inverse[k][j];
            }
            inverse[i][j] /= A[i][i];
            inverse[i][j] = Math.round((inverse[i][j] + Number.EPSILON) * precision_constant) / precision_constant;
        }
    }
    return inverse;
}
exports.inverse = inverse;
/**
 * Return determinant of matrix
 * @param matrix
 * @return determinant of matrix
 */
function determinant(matrix) {
    var _a = LUPDecompose(matrix), A = _a[0], P = _a[1];
    var N = A.length;
    var determinant = A[0][0];
    for (var i = 1; i < N; i++) {
        determinant *= A[i][i];
    }
    return (P[N] - N) % 2 == 0 ? determinant : -determinant;
}
exports.determinant = determinant;
var LinearRegression = /** @class */ (function () {
    function LinearRegression() {
    }
    LinearRegression.prototype.train = function (X, y) {
        var x = prepend(X, new Array(X.length).fill(1), 1);
        var t = transpose(x);
        this.weights = solve(dot(t, x), transpose(dot(t, y))[0]);
        return this.weights;
    };
    LinearRegression.prototype.predict = function (X) {
        var x = prepend(X, new Array(X.length).fill(1), 1);
        return dot(x, transpose(new Array(this.weights)));
    };
    return LinearRegression;
}());
exports.LinearRegression = LinearRegression;

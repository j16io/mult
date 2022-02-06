"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpose = exports.dot = exports.Matrix = void 0;
var Matrix = /** @class */ (function () {
    /**
     * Initialize array from 2d array.
     * @param matrix 2d array
     */
    function Matrix(matrix) {
        this.matrix = matrix;
        this.rows = matrix.length;
        this.columns = matrix[0].length;
        this.defineProperties();
    }
    /**
     * Shorthand for new Matrix()
     * @param matrix 2d array
     */
    Matrix.from = function (matrix) {
        return new Matrix(matrix);
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
                return transpose(_this.toArray());
            }
        });
        for (var j = 0; j < this.columns; ++j) {
            Object.defineProperty(this, j, {
                value: this.matrix[j]
            });
        }
    };
    Matrix.emptyMatrix = function (rows, columns, fill) {
        if (fill === void 0) { fill = undefined; }
        var matrix = new Array(rows);
        for (var j = 0; j < rows; j++) {
            matrix[j] = new Array(columns);
            if (typeof fill === 'number') {
                matrix[j].fill(fill);
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
    Matrix.prototype.size = function () {
        return [this.rows, this.columns];
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

interface MatrixActions {
    T: Matrix;
    dot(otherMatrix: Matrix): Matrix;
    transpose(): Matrix;
}
export declare class Matrix implements MatrixActions {
    private readonly rows;
    private readonly columns;
    private readonly matrix;
    T: Matrix;
    /**
     * Initialize array from 2d array.
     * @param matrix 2d array
     */
    constructor(matrix: number[][]);
    /**
     * Shorthand for new Matrix()
     * @param matrix 2d array
     */
    static from(matrix: number[][]): Matrix;
    /**
     * Initialize empty matrix
     * @param columns number of columns
     * @param rows number of rows
     */
    static empty(rows: number, columns?: number): Matrix;
    /**
     * Initialize matrix of zeros
     * @param columns number of columns
     * @param rows number of rows
     */
    static zeros(rows: number, columns?: number): Matrix;
    /**
     * Initialize matrix of ones
     * @param columns number of columns
     * @param rows number of rows
     */
    static ones(rows: number, columns?: number): Matrix;
    /**
     * Initialize a matrix and fill it with a number
     * @param columns number of columns
     * @param rows number of rows
     * @param fill number to fill
     */
    static fill(rows: number, columns: number, fill: number): Matrix;
    private defineProperties;
    private static emptyMatrix;
    dot(otherMatrix: Matrix): Matrix;
    transpose(): Matrix;
    size(): number[];
    toArray(): number[][];
    toString(): string;
}
/**
 * Multiply to matrices
 * @param a Matrix a
 * @param b Matrix b
 */
export declare function dot(a: Array<Array<number>>, b: Array<Array<number>>): Array<Array<number>>;
export declare function transpose(matrix: Array<Array<number>>): any[];
export {};

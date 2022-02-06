interface MatrixActions {
  T: Matrix

  dot(otherMatrix: Matrix): Matrix

  transpose(): Matrix
}

export class Matrix implements MatrixActions {
  private readonly rows: number
  private readonly columns: number
  private readonly matrix: number[][]

  // Matrix transpose
  T: Matrix

  /**
   * Initialize array from 2d array.
   * @param matrix 2d array
   * @param copy whether to copy the array or not. If copy is false, changing the initial array will change the Matrix.
   */
  constructor(matrix: number[][], copy: boolean = false) {
    if (copy) {
      this.matrix = copyArray(matrix)
    } else {
      this.matrix = matrix
    }
    this.rows = matrix.length
    this.columns = matrix[0].length
    this.defineProperties()
  }

  /**
   * Shorthand for new Matrix()
   * @param matrix 2d array
   * @param copy whether to copy the array or not.
   */
  public static from(matrix: number[][], copy: boolean = false) {
    return new Matrix(matrix, copy)
  }

  /**
   * Initialize empty matrix
   * @param columns number of columns
   * @param rows number of rows
   */
  public static empty(rows: number, columns: number = undefined) {
    if (columns === undefined) {
      return new Matrix(this.emptyMatrix(rows, rows))
    } else {
      return new Matrix(this.emptyMatrix(rows, columns))
    }
  }

  /**
   * Initialize matrix of zeros
   * @param columns number of columns
   * @param rows number of rows
   */
  public static zeros(rows: number, columns: number = undefined) {
    if (columns === undefined) {
      return new Matrix(this.emptyMatrix(rows, rows, 0))
    } else {
      return new Matrix(this.emptyMatrix(rows, columns, 0))
    }
  }

  /**
   * Initialize matrix of ones
   * @param columns number of columns
   * @param rows number of rows
   */
  public static ones(rows: number, columns: number = undefined) {
    if (columns === undefined) {
      return new Matrix(this.emptyMatrix(rows, rows, 1))
    } else {
      return new Matrix(this.emptyMatrix(rows, columns, 1))
    }
  }

  /**
   * Initialize identity matrix
   * @param dimension
   */
  public static identity(dimension: number) {
    return new Matrix(this.emptyMatrix(dimension, dimension, 0, true));
  }

  /**
   * Initialize a matrix and fill it with a number
   * @param columns number of columns
   * @param rows number of rows
   * @param fill number to fill
   */
  public static fill(rows: number, columns: number, fill: number) {
    return new Matrix(this.emptyMatrix(rows, columns, fill))
  }

  private defineProperties() {
    Object.defineProperty(this, 'T', {
      get: () => {
        return new Matrix(transpose(this.toArray()))
      }
    })
    for (let j = 0; j < this.columns; ++j) {
      Object.defineProperty(this, j, {
        value: this.matrix[j]
      })
    }
  }

  private static emptyMatrix(rows: number, columns: number, fill: number = undefined, identity: boolean = false) {
    const matrix: number[][] = new Array(rows)
    let identity_index = 0
    for (let j = 0; j < rows; j++) {
      matrix[j] = new Array(columns)
      if (typeof fill === 'number') {
        matrix[j].fill(fill)
      }
      if (identity) {
        matrix[j][identity_index] = 1
        identity_index += 1
      }
    }
    return matrix
  }

  public dot(otherMatrix: Matrix): Matrix {
    return new Matrix(dot(this.matrix, otherMatrix.matrix))
  }

  public transpose(): Matrix {
    return new Matrix(transpose(this.toArray()))
  }

  public inv(): Matrix {
    return new Matrix(inverse(this.toArray()))
  }

  public det(): number {
    return determinant(this.toArray())
  }

  public size(): [number, number] {
    return [this.rows, this.columns]
  }

  public copy(): Matrix {
    return new Matrix(copyArray(this.toArray()));
  }

  public toArray(): number[][] {
    return this.matrix
  }

  public toString(): string {
    return this.matrix.map(row => `[${row.join(',')}]`).join('\n')
  }
}

/**
 * Multiply to matrices
 * @param a Matrix a
 * @param b Matrix b
 */
export function dot(a: Array<Array<number>>, b: Array<Array<number>>): Array<Array<number>> {
  const [a_y, a_x] = [a.length, a[0].length]
  const [b_y, b_x] = [b.length, b[0].length]
  if (a_x !== b_y) {
    throw new Error(`Cannot multiply ${a_y}x${a_x} matrix with ${b_y}x${b_x} matrix`)
  }
  const [c_y, c_x] = [a_y, b_x]
  const result = new Array<Array<number>>(c_y)

  for (let c_j = 0; c_j < c_y; c_j++) {
    const row = new Array(c_x)
    for (let c_i = 0; c_i < c_x; c_i++) {
      let sum = 0
      for (let j = 0; j < a_x; j++) {
        sum += a[c_j][j] * b[j][c_i]
      }
      row[c_i] = sum
    }
    result[c_j] = row
  }

  return result
}

export function transpose(matrix: Array<Array<number>>) {
  const [c_j, c_i] = [matrix.length, matrix[0].length]
  const result = new Array(c_i)
  for (let j = 0; j < c_i; j++) {
    result[j] = new Array(c_j)
    for (let i = 0; i < c_j; i++) {
      result[j][i] = matrix[i][j]
    }
  }
  return result
}

function copyArray(matrix: number[][]): number[][] {
  const [n, m] = [matrix.length, matrix[0].length]
  const result = new Array(n)
  for (let j = 0; j < n; j++) {
    result[j] = new Array(m)
    for (let i = 0; i < m; i++) {
      result[j][i] = matrix[j][i]
    }
  }
  return result
}


/**
 * LU factorization with partial pivoting
 * @param matrix
 * @param tolerance
 * @return [A: number[][], P: number[]]: Matrix A contains a copy of both matrices L-E and U as A=(L-E)+U
 * such that P*A=L*U. P containing indices where permutation matrix is 1.
 */
export function LUPDecompose(matrix: Array<Array<number>> | Matrix, tolerance: number = 0.000001): [Array<Array<number>>, Array<number>] {
  const [n, m] = typeof matrix === typeof Matrix ? (matrix as Matrix).size(): [matrix[0].length, (matrix as Array<Array<number>>).length]
  if (n !== m) throw new Error("Matrix is not square")
  const A = copyArray((typeof matrix === typeof Matrix ? (matrix as Matrix).toArray(): matrix) as number[][])

  // Initialize permutation matrix
  const P: Array<number> = new Array(n + 1)
  for (let i = 0; i <= n; i++) {
    P[i] = i
  }

  let maxIndex;
  let maxValue;
  for (let i = 0; i < n; i++) {
    maxValue = 0.0
    maxIndex = i

    for (let k = i; k < n; k++) {
      const absA = Math.abs(matrix[k][i])
      if (absA > maxValue) {
        maxValue = absA;
        maxIndex = k;
      }
    }
    if (maxValue < tolerance) throw new Error("Matrix is degenerate")

    if (maxIndex != i) {
      const j = P[i];
      P[i] = P[maxIndex];
      P[maxIndex] = j;

      const partial = A[i];
      A[i] = A[maxIndex];
      A[maxIndex] = partial;

      P[n]++;
    }
    for (let j = i + 1; j < n; j++) {
      A[j][i] /= A[i][i];

      for (let k = i + 1; k < n; k++) {
        A[j][k] -= A[j][i] * A[i][k];
      }
    }
  }
  return [A, P]
}


/**
 * Solve system of linear equations using LU decomposition.
 * @param matrix
 * @param b
 * @param precision
 * @return x: Solution to Mx=b
 */
export function solve(matrix: Array<Array<number>> | Matrix, b: number[], precision: number = 6): number[] {
  const [A, P] = LUPDecompose(matrix)
  const N: number = A.length
  const x: number[] = new Array(N)
  const precision_constant = Math.pow(10, precision)
  for (let i = 0; i < N; i++) {
    x[i] = b[P[i]];
    for (let k = 0; k < i; k++) {
      x[i] -= A[i][k] * x[k];
    }
  }
  for (let i = N - 1; i >= 0; i--) {
    for (let k = i + 1; k < N; k++) {
      x[i] -= A[i][k] * x[k];
    }
    x[i] /= A[i][i];
    x[i] = Math.round((x[i] + Number.EPSILON) * precision_constant) / precision_constant
  }
  return x
}

/**
 * Calculate inverse of matrix
 * @param matrix
 * @param precision
 * @return inverse: The inverse of the matrix
 */
export function inverse(matrix: Array<Array<number>>, precision: number = 6): number[][] {
  if ( precision < 0 || precision > 15 ) throw new Error("Precision must be a number between 1 and 15")
  const [A, P] = LUPDecompose(matrix)
  const N: number = A.length
  const inverse = new Array(N)
  const precision_constant = Math.pow(10, precision)
  for (let j = 0; j < N; j++) {
    inverse[j] = new Array(N)
  }
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      inverse[i][j] = P[i] == j ? 1.0 : 0.0;

      for (let k = 0; k < i; k++) {
        inverse[i][j] -= A[i][k] * inverse[k][j];
      }
    }

    for (let i = N - 1; i >= 0; i--) {
      for (let k = i + 1; k < N; k++) {
        inverse[i][j] -= A[i][k] * inverse[k][j];
      }

      inverse[i][j] /= A[i][i];
      inverse[i][j] = Math.round((inverse[i][j] + Number.EPSILON) * precision_constant) / precision_constant
    }
  }
  return inverse
}

/**
 * Return determinant of matrix
 * @param matrix
 * @return determinant of matrix
 */
export function determinant(matrix: Array<Array<number>>) {
  const [A, P] = LUPDecompose(matrix)
  const N: number = A.length
  let determinant = A[0][0];

  for (let i = 1; i < N; i++) {
    determinant *= A[i][i];
  }

  return (P[N] - N) % 2 == 0 ? determinant : -determinant;
}

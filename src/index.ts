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
   */
  constructor(matrix: number[][]) {
    this.matrix = matrix
    this.rows = matrix.length
    this.columns = matrix[0].length
    this.defineProperties()
  }

  /**
   * Shorthand for new Matrix()
   * @param matrix 2d array
   */
  public static from(matrix: number[][]) {
    return new Matrix(matrix)
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

  private static emptyMatrix(rows: number, columns: number, fill: number = undefined) {
    const matrix: number[][] = new Array(rows)
    for (let j = 0; j < rows; j++) {
      matrix[j] = new Array(columns)
      if (typeof fill === 'number') {
        matrix[j].fill(fill)
      }
    }
    return matrix
  }

  public dot(otherMatrix: Matrix): Matrix {
    return new Matrix(dot(this.matrix, otherMatrix.matrix))
  }

  public transpose() {
    return new Matrix(transpose(this.toArray()))
  }

  public size() {
    return [this.rows, this.columns]
  }

  public toArray() {
    return this.matrix
  }

  public toString() {
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

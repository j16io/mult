import {equal, deepEqual, notDeepEqual} from 'assert'
import {describe, test} from 'mocha'
import {add, append, determinant, dot, inverse, LinearRegression, Matrix, prepend, solve, transpose} from './index'

const compareArrays = (a: number[][], b: number[][], precision: number = 10): boolean => {
  const [a_y, a_x] = [a.length, a[0].length]
  const [b_y, b_x] = [b.length, b[0].length]
  if (a_y !== b_y || a_x !== b_x) throw new Error('Matrices don\'t have equal dimensions')
  let allSame = true
  for (let j = 0; j < a_y; j++) {
    for (let i = 0; i < a_x; i++) {
      allSame = allSame && a[j][i].toFixed(precision) === b[j][i].toFixed(precision)
    }
  }
  return true
}
describe("Matrix operations", () => {
  test('Multiplication', () => {
    let a = [[2, 2], [2, 2]]
    let b = [[2, 2], [2, 2]]
    let c = [[8, 8], [8, 8]]
    let res = dot(a, b)

    equal(compareArrays(res, c), true)

    a = [[2, 2, 2]]
    b = [[1], [2], [3]]
    c = [[12]]
    res = dot(a, b)

    equal(compareArrays(res, c), true)

    const res_m = Matrix.from(a).dot(Matrix.from(b))
    const c_m = Matrix.from(c)
    equal(compareArrays(res_m.toArray(), c_m.toArray()), true)

    c = [[2, 2, 2], [4, 4, 4], [6, 6, 6]]
    res = dot(b, a)

    equal(compareArrays(res, c), true)
  })

  test('Initialization', () => {
    let m = Matrix.zeros(2, 2)

    equal(m[0][0], 0)
    equal(m[1][0], 0)
    equal(m[0][1], 0)
    equal(m[1][1], 0)

    m = Matrix.zeros(2)
    equal(m[0][0], 0)
    equal(m[1][0], 0)
    equal(m[0][1], 0)
    equal(m[1][1], 0)

    m = Matrix.empty(2, 2)
    equal(m[0][0], undefined)
    equal(m[1][0], undefined)
    equal(m[0][1], undefined)
    equal(m[1][1], undefined)

    m = Matrix.empty(2)
    equal(m[0][0], undefined)
    equal(m[1][0], undefined)
    equal(m[0][1], undefined)
    equal(m[1][1], undefined)

    m = Matrix.ones(2, 2)
    equal(m[0][0], 1)
    equal(m[1][0], 1)
    equal(m[0][1], 1)
    equal(m[1][1], 1)

    m = Matrix.ones(2)
    equal(m[0][0], 1)
    equal(m[1][0], 1)
    equal(m[0][1], 1)
    equal(m[1][1], 1)

    // Test setter and getter
    m[1][1] = 4
    equal(m[1][1], 4)

    const nm = [[2, 2], [2, 2]]
    m = new Matrix(nm)
    equal(m[0][0], 2)
    equal(m[1][0], 2)
    equal(m[0][1], 2)
    equal(m[1][1], 2)

    m = Matrix.from(nm)
    equal(m[0][0], 2)
    equal(m[1][0], 2)
    equal(m[0][1], 2)
    equal(m[1][1], 2)

    m = Matrix.ones(4, 3)
    deepEqual(m.size(), [4, 3])


  })

  test("toString", () => {
    let m = Matrix.ones(1, 2)
    equal(m.toString(), "[1,1]")
    m = Matrix.ones(2, 2)
    equal(m.toString(), "[1,1]\n[1,1]")
  })

  test("toString", () => {
    const m = Matrix.fill(1, 1, 3)
    deepEqual(m.toArray(), [[3]])
  })

  test('Transpose', () => {
    const a_t = [[1, 2], [3, 4], [5, 6]]
    const c_t = [[1, 3, 5], [2, 4, 6]]

    equal(compareArrays(c_t, Matrix.from(transpose(a_t)).toArray()), true)
    equal(compareArrays(c_t, Matrix.from(a_t).transpose().toArray()), true)
    equal(compareArrays(c_t, Matrix.from(a_t).T.toArray()), true)
  })

  test('Identity', () => {
    const identity = Matrix.identity(3)
    const true_identity = Matrix.from([[1, 0, 0], [0, 1, 0], [0, 0, 1]])
    deepEqual(identity, true_identity)
  })

  test("Copy", () => {
    let true_copy = [[1, 2], [3, 4], [5, 6]]
    let copy = Matrix.from([[1, 2], [3, 4], [5, 6]]).copy()
    deepEqual(copy.toArray(), true_copy)

    true_copy = [[1, 2], [3, 4], [5, 6]]
    copy = Matrix.from(true_copy)
    true_copy[0][0] = 7
    deepEqual(copy.toArray(), true_copy)

    true_copy = [[1, 2], [3, 4], [5, 6]]
    copy = Matrix.from(true_copy)
    true_copy[0][0] = 7
    deepEqual(copy.toArray(), true_copy)
  })

  test("Determinant", () => {
    let det = determinant([[1, 2], [3, 4]])
    deepEqual(det, -2)

    let a = [[1, 3, 5, 9], [1, 3, 1, 7], [4, 3, 9, 7], [5, 2, 0, 9]]
    det = determinant(a)
    deepEqual(det, -376)
  })
  test("Inverse", () => {
    const a = [[1, 2], [3, 4]]
    let true_inverse = [[-2, 1], [3 / 2, -1 / 2]]
    deepEqual(inverse(a), true_inverse)


// Matrix inverse
    let inv_m = [[1, 3, 5, 9], [1, 3, 1, 7], [4, 3, 9, 7], [5, 2, 0, 9]]
    let inv = inverse(inv_m, 15)
    true_inverse = [
      [-13 / 47, 2 / 47, 7 / 47, 6 / 47],
      [-5 / 8, 7 / 8, 1 / 4, -1 / 4],
      [39 / 376, -56 / 376, 13 / 188, -9 / 188],
      [55 / 188, -41 / 188, -13 / 94, 9 / 94]
    ]
    equal(compareArrays(inv, true_inverse), true)
  })

  test('Prepend', () => {
    const V = [0, 0, 0]
    const P = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]
    const py = [
      [0, 0, 0],
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]
    deepEqual(prepend(P, V, 0), py)
    const px = [
      [0, 1, 2, 3],
      [0, 4, 5, 6],
      [0, 7, 8, 9]
    ]
    deepEqual(prepend(P, V, 1), px)

  })

  test("Append", () => {
    const V = [0, 0, 0]
    const P = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]
    const ay = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [0, 0, 0]
    ]
    deepEqual(append(P, V, 0), ay)

    const ax = [
      [1, 2, 3, 0],
      [4, 5, 6, 0],
      [7, 8, 9, 0]
    ]
    deepEqual(append(P, V, 1), ax)
  })

  test('Add', () => {
    const m1 = Matrix.from([[1, 1], [1, 1]])
    const m2 = Matrix.from([[1, 1], [1, 1]])
    const result = [[2, 2], [2, 2]]
    deepEqual(m1.add(m2).toArray(), result)
  })

  test('subtract', () => {
    const m1 = Matrix.from([[2, 2], [2, 2]])
    const m2 = Matrix.from([[1, 1], [1, 1]])
    const result = [[1, 1], [1, 1]]
    deepEqual(m1.subtract(m2).toArray(), result)
  })

  test('norm', () => {
    let m = Matrix.from([[1, 1], [1, 1]])
    deepEqual(m.norm(), 2)

    m = Matrix.from([[2, 2], [2, 2]])
    deepEqual(m.norm(), 4)

    m = Matrix.from([[3, 3], [3, 3]])
    deepEqual(m.norm(), 6)
  })
})


test('Solve', () => {
  let A = [[2, 3, -2], [1, -1, -3], [1, 5, 2]]
  let B = [7, 5, 10]
  let true_x = [99, -35, 43]
  deepEqual(solve(A, B), true_x)
})

test('Linear regression', () => {
  let A = [[2, 3, -2], [1, -1, -3], [1, 5, 2]]
  let B = [7, 5, 10]
  let true_x = [99, -35, 43]
  deepEqual(solve(A, B), true_x)

  // Linear regression
  const clf = new LinearRegression()
  const lr_X = [
    [0.18, 0.89],
    [1.0, 0.26],
    [0.92, 0.11],
    [0.07, 0.37],
    [0.85, 0.16],
    [0.99, 0.41],
    [0.87, 0.47],
  ]
  const lr_y = [
    [109.85],
    [155.72],
    [137.66],
    [76.17],
    [139.75],
    [162.6],
    [151.77],
  ]
  const lr_X_test = [
    [0.49, 0.18],
    [0.57, 0.83],
    [0.56, 0.64],
    [0.76, 0.18],
  ]
  const lr_y_test = [
    [105.21455835],
    [142.67095131],
    [132.93605469],
    [129.70175405],
  ]
  clf.train(lr_X, lr_y)
  equal(compareArrays(lr_y_test, clf.predict(lr_X_test)), true)
})



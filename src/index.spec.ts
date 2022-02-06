import {equal, deepEqual, notDeepEqual} from 'assert'
import {determinant, dot, inverse, Matrix, solve, transpose} from './index'

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

m = Matrix.ones(1, 2)
equal(m.toString(), "[1,1]")

m = Matrix.ones(2, 2)
equal(m.toString(), "[1,1]\n[1,1]")

m = Matrix.fill(1, 1, 3)
deepEqual(m.toArray(), [[3]])

const a_t = [[1, 2], [3, 4], [5, 6]]
const c_t = [[1, 3, 5], [2, 4, 6]]

equal(compareArrays(c_t, Matrix.from(transpose(a_t)).toArray()), true)
equal(compareArrays(c_t, Matrix.from(a_t).transpose().toArray()), true)
equal(compareArrays(c_t, Matrix.from(a_t).T.toArray()), true)


// Test identity
const identity = Matrix.identity(3)
const true_identity = Matrix.from([[1, 0, 0], [0, 1, 0], [0, 0, 1]])
deepEqual(identity, true_identity)

// Test Copy
let true_copy = [[1, 2], [3, 4], [5, 6]]
let copy = Matrix.from([[1, 2], [3, 4], [5, 6]]).copy()
deepEqual(copy.toArray(), true_copy)


// Test Copy
true_copy = [[1, 2], [3, 4], [5, 6]]
copy = Matrix.from(true_copy).copy()
true_copy[0][0] = 7
notDeepEqual(copy.toArray(), true_copy)


// Test Copy
true_copy = [[1, 2], [3, 4], [5, 6]]
copy = Matrix.from(true_copy)
true_copy[0][0] = 7
deepEqual(copy.toArray(), true_copy)

// Matrix determinant
let det = determinant([[1, 2], [3, 4]])
deepEqual(det, -2)

a = [[1, 3, 5, 9], [1, 3, 1, 7], [4, 3, 9, 7], [5, 2, 0, 9]]
det = determinant(a)
deepEqual(det, -376)


// Matrix inverse
a = [[1, 2], [3, 4]]
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


// Solve matrix equations
let A = [[2, 3, -2], [1, -1, -3], [1, 5, 2]]
let B = [7, 5, 10]
let true_x = [99, -35, 43]
deepEqual(solve(A, B), true_x)


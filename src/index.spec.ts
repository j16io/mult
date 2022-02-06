import {equal, deepEqual} from 'assert'
import {dot, Matrix, transpose} from './index'

const compareArrays = (a: number[][], b: number[][]): boolean => {
  const [a_y, a_x] = [a.length, a[0].length]
  const [b_y, b_x] = [b.length, b[0].length]
  if (a_y !== b_y || a_x !== b_x) throw new Error('Matrices don\'t have equal dimensions')
  let allSame = true
  for (let j = 0; j < a_y; j++) {
    for (let i = 0; i < a_x; i++) {
      allSame = allSame && a[j][i] === b[j][i]
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

let m = Matrix.zeros(2,2)
equal(m[0][0], 0)
equal(m[1][0], 0)
equal(m[0][1], 0)
equal(m[1][1], 0)

m = Matrix.zeros(2)
equal(m[0][0], 0)
equal(m[1][0], 0)
equal(m[0][1], 0)
equal(m[1][1], 0)

m = Matrix.empty(2,2)
equal(m[0][0], undefined)
equal(m[1][0], undefined)
equal(m[0][1], undefined)
equal(m[1][1], undefined)

m = Matrix.empty(2)
equal(m[0][0], undefined)
equal(m[1][0], undefined)
equal(m[0][1], undefined)
equal(m[1][1], undefined)

m = Matrix.ones(2,2)
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

const nm = [[2,2],[2,2]]
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
deepEqual(m.size(), [4,3])

m = Matrix.ones(1, 2)
equal(m.toString(), "[1,1]")

m = Matrix.ones(2, 2)
equal(m.toString(), "[1,1]\n[1,1]")

m = Matrix.fill(1, 1, 3)
deepEqual(m.toArray(), [[3]])

const a_t = [[1,2],[3,4],[5,6]]
const c_t = [[1,3,5],[2,4,6]]

equal(compareArrays(c_t, Matrix.from(transpose(a_t)).toArray()), true)
equal(compareArrays(c_t, Matrix.from(a_t).transpose().toArray()), true)
equal(compareArrays(c_t, Matrix.from(a_t).T.toArray()), true)


// Test identity
const identity = Matrix.identity(3)
const true_identity = Matrix.from([[1,0,0],[0,1,0],[0,0,1]])
deepEqual(identity, true_identity)

# Matrix operations in Javascript


## Install

```
npm i jonatanai --save
```

## Usage

### Matrix from 2d array

```
let a = [[2, 2], [2, 2]]
new Matrix([[2, 2], [2, 2]])
Matrix.from([[2, 2], [2, 2]])
```
### Matrix from 2d array

```
let a = [[2, 2], [2, 2]]
new Matrix(a)
Matrix.from(a)
a[0][0] = 3 // Will change the matrices. If this is not desired do new Matrix(a, true)
```

### Empty matrix

```
Matrix.empty(2) // = [[undefined, undefined], [undefined, undefined]]
Matrix.empty(2, 3) // = [[undefined, undefined], [undefined, undefined], [undefined, undefined]]
```

### Matrix of ones

```
Matrix.ones(2) // = [[1, 1], [1, 1]]
Matrix.ones(2, 3) // = [[0, 0], [0, 0], [0, 0]]
```


### Zero matrix

```
Matrix.zeros(2) // = [[0, 0], [0, 0]]
Matrix.zeros(2, 3) // = [[0, 0], [0, 0], [0, 0]]
```

### Identity matrix

```
Matrix.identity(3) // = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
```

### Matrix multiplication
```
let a = [[2, 2], [2, 2]]
let b = [[2, 2], [2, 2]]
dot(a, b) // = [[8, 8], [8, 8]]

const m1 = new Matrix(a)
const m2 = new Matrix(b)

m1.dot(m2) // = [[8, 8], [8, 8]]

```
### Transpose

```
const a = [[1,2],[3,4],[5,6]]

transpose(a) // [[1,3,5],[2,4,6]]
Matrix.from(a).transpose() // [[1,3,5],[2,4,6]]
Matrix.from(a).T // [[1,3,5],[2,4,6]]
```

### Matrix determinant

```
determinant([[1, 2], [3, 4]]) // -2
determinant([[1, 3, 5, 9], [1, 3, 1, 7], [4, 3, 9, 7], [5, 2, 0, 9]]) // -376
```

### Matrix inverse

```
inverse([[1, 2], [3, 4]]) // [[-2, 1], [3 / 2, -1 / 2]]

inverse([[1, 3, 5, 9], [1, 3, 1, 7], [4, 3, 9, 7], [5, 2, 0, 9]])
// = [
//  [-13 / 47, 2 / 47, 7 / 47, 6 / 47],
//  [-5 / 8, 7 / 8, 1 / 4, -1 / 4],
//  [39 / 376, -56 / 376, 13 / 188, -9 / 188],
//  [55 / 188, -41 / 188, -13 / 94, 9 / 94]
//]
```

### Solve matrix equations

```
let A = [[2, 3, -2], [1, -1, -3], [1, 5, 2]]
let B = [7, 5, 10]
solve(A, B) // [99, -35, 43]
```

### Copy

Return a new copy of the matrix shorthand for `new Matrix(m.toArry())`

```
const a = [[1,2],[3,4],[5,6]]

Matrix.from(a).copy() // [[1,2],[3,4],[5,6]]
```

### Size

```
m = Matrix.ones(4, 3)
m.size() // = [4,3]
```

### toString

```
m = Matrix.fill(3, 3, 4)
m.toString()
# [4,4,4]
# [4,3,3]
# [4,4,4]
```


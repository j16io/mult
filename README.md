# Matrix operations in Javascript


## Install

```
npm i jonatanai --save
```

## Usage

### Matrix from 2d array

```
let a = [[2, 2], [2, 2]]
new Matrix(a)
Matrix.from(a)
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

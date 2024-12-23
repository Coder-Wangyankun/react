// ES6 有直接将数组扁平化的方法，即 flat()，使用方法如下：
// array.flat(depth) depth，可选，指定要提取嵌套数组的结构深度，默认值为 1

function flatten(arr) {
  let res = []
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      res = res.concat(flatten(item))
    } else {
      res.push(item)
    }
  })
  return res
}

const arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]]
console.log(flatten(arr4))
// function unique(arr) {
//   return arr.filter((item, index) => arr.indexOf(item) === index)
// }

function unique(arr) {
  return [...new Set(arr)]
}
console.log(unique([1, 1, 2, 2, 3, 3]))
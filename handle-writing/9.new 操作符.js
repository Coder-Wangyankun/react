// function myNew(fn, ...args) {
//   let obj = Object.create(fn.prototype);
//   let res = fn.call(obj, ...args);
//   if (res && (typeof res === 'object' || typeof res === 'function')) {
//     return res;
//   }
//   return obj;
// }

function myNew() {
  let obj = new Object()
  let Constructor = [].shift.call(arguments)
  obj.__proto__ = Constructor.prototype
  let res = Constructor.apply(obj, arguments)
  if (res && (typeof res === 'object' || typeof res === 'function')) {
    return res
  }
  return obj
}

function person(name, age) {
  this.name = name
  this.age = age
}
let p = myNew(person, '布兰', 12)
console.log(p)  // { name: '布兰', age: 12 }

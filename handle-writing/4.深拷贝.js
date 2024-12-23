function isObject(val) {
  return typeof val === 'object' && val !== null
}
function deepClone(obj, map = new WeakMap()) {
  if (!isObject(obj)) return obj
  if (map.has(obj)) {
    return obj
  }
  const target = Array.isArray(obj) ? [] : {}
  map.set(obj, true)
  for (let key in obj) {
    if (isObject(obj[key])) {
      target[key] = deepClone(obj[key], map)
    } else {
      target[key] = obj[key]
    }
  }
  return target
}

// 定义两个对象
let obj1 = {};
let obj2 = {};

// 创建循环引用
obj1.ref = obj2;
obj2.ref = obj1; 
console.log(deepClone(obj1))
console.log(deepClone(obj2))
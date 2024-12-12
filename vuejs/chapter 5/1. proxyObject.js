const obj = {
  foo: 1
}

let ITERATE_KEY = Symbol()
const p = new Proxy(obj, {
  has(target, key) {
    console.log(`has ${key}`)
    return Reflect.has(target, key)
  },
  get(target, key, receiver) {
    console.log(`get ${key}`)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log(`set ${key} ${value}`)
    target[key] = value
  }
})


for (const key in p) {
  console.log(key)
}
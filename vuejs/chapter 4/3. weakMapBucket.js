// 解决副作用函数硬编码的问题
// 建立副作用函数与被操作字段之间的联系

const bucket = new WeakMap()

const data = {
  text: 'hello world'
}

let activeEffect
const effect = (fn) => {
  activeEffect = fn
  fn()
}

const obj = new Proxy(data, {
  get(target, key) {
    if (!activeEffect) return target[key]
    let depsMap = bucket.get(target)
    if (!depsMap) {
      bucket.set(target, depsMap = new Map())
    }
    let deps = depsMap.get(key)
    if (!deps) {
      depsMap.set(key, deps = new Set())
    }
    deps.add(key, activeEffect)
    return target[key]
  }
})
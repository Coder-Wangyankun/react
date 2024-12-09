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
    const depsMap = bucket.get(target)
    if (!depsMap) {
      bucket.set(target, depsMap = new Map())
    }
    const deps = depsMap.get(key)
    if (!deps) {
      depsMap.set(key, deps = new Set())
    }
    deps.add(key, activeEffect)
    return target[key]
  }
})
const data = {
  text: 'hello'
}

let activeEffect
const effect = (fn) => {
  activeEffect = fn
  fn()
}

const bucket = new WeakMap()

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    trigger(target, key)
  }
})

const track = (target, key) => {
  if (!activeEffect) return
  const depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, depsMap = new Map())
  }
  const deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, deps = new Set())
  }
  deps.add(activeEffect)
}

const trigger = (target, key) => {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  effects && deps.forEach(fn => fn())
}
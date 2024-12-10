// 抽离track和trigger函数

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
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, depsMap = new Map())
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, deps = new Set())
  }
  deps.add(activeEffect)
}

const trigger = (target, key) => {
  let depsMap = bucket.get(target)
  if (!depsMap) return
  let effects = depsMap.get(key)
  effects && effects.forEach(fn => fn())
}

effect(() => {
  document.body.innerText = obj.text
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 3000)
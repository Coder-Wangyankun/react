// 由三元运算符引出
// 副作用函数每次执行的时候，把它从相关联的依赖集合中移除
// 副作用函数执行后，再重新记录副作用函数与字段的联系

const data = {
  ok: true,
  text: 'hello world'
}

let activeEffect
const effect = (fn) => {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
  }
  effectFn.deps = []
  effectFn()
}

const cleanup = (effectFn) => {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i] // set集合
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
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
  activeEffect.deps.push(deps)
}

const trigger = (target, key) => {
  let depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  const effectsToRun = new Set(effects)
  effectsToRun.forEach(effectFn => effectFn())
}

effect(function effectFn() {
  console.log('effectFn run')
  document.body.innerText = obj.ok ? obj.text : 'not'
})

// 此时的依赖
// ok => set(1) effectFn
// text => set(1) effectFn

obj.ok = false
// 此时的依赖
// ok => set(1) effectFn
// text => set(0)

setTimeout(() => {
  obj.ok = true
}, 3000)
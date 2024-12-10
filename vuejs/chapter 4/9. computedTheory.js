const data = {
  foo: 1,
  bar: 2
}

let activeEffect
const effectStack = []
const effect = (fn, options = {}) => {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    const res = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return res // 获取getter的返回值
  }
  effectFn.deps = []
  effectFn.options = options
  if (!options.lazy) {
    effectFn()
  }
  return effectFn // 不立即执行，所以需要拿到引用
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
  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}

const effectFn =  effect(
  // getter
  () => {
    return obj.foo + obj.bar
  }, 
  {
    lazy: true // 不立即执行副作用函数
  }
)

const value = effectFn() // 手动执行

const computed = (getter) => {
  let value // 缓存值
  let dirty = true

  // 不立即执行getter函数，但是会获取getter函数的wrap函数
  // 在获取value的时候再执行wrap函数，该函数的返回值是getter的值
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      // 设置值的时候触发trigger，使用scheduler执行副作用函数
      // 这个时候数据已经脏了，dirty设置为true
      if (!dirty) {
        dirty = true
        trigger(obj, 'value')
      }
    }
  })

  const obj = {
    get value() {
      // 脏的时候才计算
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      track(obj, 'value')
      return value
    }
  }

  return obj
}

const sumRes = computed(() => {
  return obj.foo + obj.bar
})
// console.log(sumRes.value) // 真正读取value的时候才会执行副作用函数进行计算

effect(function effectFn() {
  console.log('sumRes.value ', sumRes.value)
})
obj.foo = 2 // 会执行effectFn
const data = {
  foo: 1
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

const watch = (source, cb, options = {}) => {
  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  let oldVal, newVal

  const job = () => {
    newVal = effectFn()
    cb(newVal, oldVal)
    oldVal = newVal
  }
  const effectFn = effect(
    () => getter(),
    {
      lazy: true,
      scheduler: () => {
        // 控制副作用函数的调用时机
        if (options.flush === 'post') {
          const p = Promise.resolve()
          p.then(job)
        } else {
          job()
        }
      }
    }
  )
  if (options.immediate) {
    job()
  } else {
    oldVal = effectFn()
  }
}

const traverse = (value, seen = new Set()) => {
  // typeof就是读取操作
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  seen.add(value) // 处理循环引用
  for (const key in value) {
    traverse(value[key], seen)
  }
  return value
}

watch(obj, (newVal, oldVal) => {
  console.log('数据变化了 ', newVal, ' ', oldVal)
}, {
  // 回调函数在watch创建时立即执行一次
  immediate: true
})

// obj.foo++
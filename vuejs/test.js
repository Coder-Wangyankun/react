const data = {
  foo: {
    bar: 1
  },
  a: 1
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

const watch = (source, cb, options = {}) => {
  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  let oldVal, newVal

  // cleanup用于存储用户注册的过期回调
  let cleanup
  function onInvalidate(fn) {
    // 将过期函数存储到cleanup中
    cleanup = fn
  }

  const job = () => {
    debugger
    newVal = effectFn()
    // 调用回调函数cb之前，先调用过期回调
    if (cleanup) {
      debugger
      cleanup()
    }
    cb(newVal, oldVal, onInvalidate)
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

effect(() => {
  console.log(obj.foo.bar)
  // console.log(obj.a)
})
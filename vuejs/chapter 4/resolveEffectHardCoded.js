const bucket = new Set()

const data = {
  text: 'hello world'
}

const obj = new Proxy(data, {
  get(target, key) {
    if (activeEffect) {
      bucket.add(activeEffect)
    }
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    bucket.forEach(fn => fn())
    return true
  }
})

let activeEffect
// 注册副作用函数
function effect(fn) {
  activeEffect = fn
  fn()
}

effect(() => {
  document.body.innerText = obj.text
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 3000)
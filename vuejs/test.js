let activeEffect
const effect = (fn) => {
  activeEffect = fn
  fn()
}

let bucket = new Set()

const data = {
  text: 'hello world'
}

const obj = new Proxy(data, {
  get(target, key) {
    bucket.add(activeEffect)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    bucket.forEach(fn => fn())
    return true
  }
})
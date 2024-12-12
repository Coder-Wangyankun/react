const obj = {
  foo: 1,
  get bar() {
    return this.foo
  }
}

const p = new Proxy(obj, {
  get(target, key) {
    track(target, key)
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    trigger(target, key)
    return true
  }
})
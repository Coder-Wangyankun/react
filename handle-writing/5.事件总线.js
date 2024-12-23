class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(name, fn) {
    if (this.events[name]) {
      this.events[name].push(fn);
    } else {
      this.events[name] = [fn];
    }
  }
  emit(name, ...args) {
    if (this.events[name]) {
      this.events[name].forEach(fn => fn(...args));
    }
  }
  once(name, fn) {
    const once = (...args) => {
      fn(...args);
      this.off(name, once);
    };
    once.callback = fn;
    this.on(name, once);
  }
  off(name, fn) {
    let tasks = this.events[name];
    if (tasks) {
      let index = tasks.findIndex(f => f === fn || f.callback === fn);
      if (index >= -1) {
        tasks.splice(index, 1);
      }
    }
  }
}
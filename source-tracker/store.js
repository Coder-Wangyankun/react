// store.ts
export const metricsName = {
  FP: 'first-paint',
  FCP: 'first-contentful-paint',
  LCP: 'largest-contentful-paint',
  FID: 'first-input-delay',
  CLS: 'cumulative-layout-shift',
  NT: 'navigation-timing',
  RF: 'resource-flow',
}


// Map 暂存数据
export default class metricsStore {

  constructor() {
    this.state = new Map();
  }

  set(key, value) {
    this.state.set(key, value);
  }

  add(key, value) {
    const keyValue = this.state.get(key);
    this.state.set(key, keyValue ? keyValue.concat([value]) : [value]);
  }

  get(key) {
    return this.state.get(key);
  }

  has(key) {
    return this.state.has(key);
  }

  clear() {
    this.state.clear();
  }

  getValues() {
    // Map 转为 对象 返回
    return Object.fromEntries(this.state);
  }
}



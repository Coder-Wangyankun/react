import MetricsStore, { metricsName } from './store.js';

import aa from './methods/index.js'
console.log(aa.fp)



export const afterLoad = (callback) => {
  if (document.readyState === 'complete') {
    setTimeout(callback);
  } else {
    window.addEventListener('pageshow', callback, { once: true, capture: true });
  }
};

export const observe = (type, callback) => {
  // 类型合规，就返回 observe
  if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
    const ob = new PerformanceObserver((l) => l.getEntries().map(callback));

    ob.observe({ type, buffered: true });
    return ob;
  }
  return undefined;
};

// 初始化入口，外部调用只需要 new WebVitals();
export default class WebVitals {
  constructor(engineInstance) {
    this.engineInstance = engineInstance;
    this.metrics = new MetricsStore();
    this.initLCP();
    this.initCLS();
    this.initResourceFlow();

    // 这里的 FP/FCP/FID需要在页面成功加载了再进行获取
    afterLoad(() => {
      this.initNavigationTiming();
      this.initFP();
      this.initFCP();
      this.initFID();
      this.perfSendHandler();
    });
  }

  // 性能数据的上报策略
  perfSendHandler = () => {
    // 如果你要监听 FID 数据。你就需要等待 FID 参数捕获完成后进行上报;
    // 如果不需要监听 FID，那么这里你就可以发起上报请求了;
  };

  // 初始化 FP 的获取以及返回
  initFP = () => {
    const entry = aa.fp();
    const metrics = {
      startTime: entry?.startTime.toFixed(2),
      entry,
    }
    this.metrics.set(metricsName.FP, metrics);
    console.log(this.metrics)
  };

  // 初始化 FCP 的获取以及返回
  initFCP = () => {
    //... 详情代码在下文
  };

  // 初始化 LCP 的获取以及返回
  initLCP = () => {
    //... 详情代码在下文
  };

  // 初始化 FID 的获取 及返回
  initFID = () => {
    //... 详情代码在下文
  };

  // 初始化 CLS 的获取以及返回
  initCLS = () => {
    //... 详情代码在下文
  };

  // 初始化 NT 的获取以及返回
  initNavigationTiming = () => {
    //... 详情代码在下文
  };

  // 初始化 RF 的获取以及返回
  initResourceFlow = () => {
    //... 详情代码在下文
  };
}
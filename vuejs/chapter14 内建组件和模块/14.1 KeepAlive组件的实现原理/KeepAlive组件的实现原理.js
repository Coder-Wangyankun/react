const KeepAlive = {
  __isKeepAlive: true, // KeepAlive组件标识
  props: {
    include: RegExp,
    exclude: RegExp
  },
  setup(props, { slots }) {
    const cache = new Map() // 创建一个缓存对象
    const instance = currentInstance // 获取当前KeepAlive组件实例
    // KeepAlive组件实例上存在特殊的keepAliveCtx对象
    const { move, createElement } = instance.keepAliveCtx

    const storageContainer = createElement('div') // 创建隐藏容器

    // KeepAlive的特有生命周期钩子
    instance._deActivate = (vnode) => {
      move(vnode, storageContainer)
    }
    instance._activate = (vnode, container, anchor) => {
      move(vnode, container, anchor)
    }

    return () => {
      let rawVNode = slots.default() // 获取被KeepAlive包裹的组件
      if (typeof rawVNode.type !== 'object') {
        return rawVNode // 非组件的虚拟节点无法被KeepAlive缓存
      }

      // 获取 ”内部组件“ 的 name
      const name = rawVNode.type.name
      if (
        name &&
        (
          props.include && !props.include.test(name) ||
          props.exclude && props.exclude.test(name)
        )
      ) {
        // 如果 name 无法被 include 匹配
        // 或者被 exclude 匹配
        // 则直接渲染 ”内部组件“，不对其进行后续的缓存操作
        return rawVNode
      }

      const cachedVNode = cache.get(rawVNode.type) // 获取缓存的组件
      if (cachedVNode) {
        // 如果缓存存在，则无需重新创建组件实例，只需要继承即可
        rawVNode.component = cachedVNode.component
        rawVNode.keptAlive = true // 标识组件已经被缓存，避免重新渲染
      } else {
        cache.set(rawVNode.type, rawVNode)
      }

      rawVNode.shouleKeepAlive = true // 避免组件被卸载
      rawVNode.keepAliveInstance = instance // KeepAlive组件的实例也添加到组件vnode上，便于渲染器访问

      return rawVNode
    }
  }
}

function unmount(vnode) {
  if (vnode.type === Fragment) {
    // ...
  }
  else if (typeof vnode.type === 'object') {
    if (vnode.shouldKeepAlive) {
      vnode.keepAliveInstance._deActivate(vnode)
    } else {
      unmount(vnode.component.subTree)
    }
    return
  }
}

function patch(n1, n2, container, anchor) {
  if (n1 && n1.type !== n2.type) {
    unmount(n1)
    n1 = null
  }

  const { type } = n2
  if (typeof type === 'string') {
    // ...
  } else if (type === Text) { // Symbol
    // ...
  } else if (type === Fragment) { // Symbol
    // ...
  } else if (typeof type === 'object' || typeof type === 'function') {
    // 如果该组件已经被 KeepAlive，则不会重新挂载它，而是会调用 _activate 来激活它
    if (n2.keptAlive) {
      n2.keepAliveInstance._activate(n2, container, anchor)
    } else {
      mountComponent(n2, container, anchor)
    }
  } else {
    patchComponent(n1, n2, anchor)
  }
}

function mountComponent(vnode, container, anchor) {
  // ...

  const instance = {
    state,
    props: ShallowReactive(props),
    isMounted: false,
    subTree: null,
    slots,
    mounted: [],
    keepAliveCtx: null // 只有 KeepAlive 组件的实例下会有 keepAliveCtx 属性
  }

  // 判断当前要挂在的组件是否是 KeepAlive 组件
  const isKeepAlive = vnode.type.__isKeepAlive
  if (isKeepAlive) {
    // 在 KeepAlive 组件实例上添加 keepAliveCtx 对象
    instance.keepAliveCtx = {
      // move 用来将组件渲染的内容移动到指定容器中，即隐藏容器中
      move(vnode, container, anchor) {
        // vnode.component.subTree.el 代表一个组件
        insert(vnode.component.subTree.el, container, anchor)
      }
    }
  }
}
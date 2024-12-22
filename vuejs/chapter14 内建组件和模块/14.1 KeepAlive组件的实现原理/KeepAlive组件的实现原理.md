# KeepAlive 组件的作用

缓存组件状态，避免频繁的销毁和重建。

1. 当 “卸载” 一个被 KeepAlive 的组件时，它不会真的被卸载，而是会被移动到一个隐藏容器中。
2. 当重新 “挂载” 该组件时，它也不会真的被挂载，而会被从隐藏容器中取出，再 “放回” 到原来的容器中。

# 分析 KeepAlive 的源码

1. KeepAlive 组件不会渲染额外的内容，它的渲染函数最终只返回需要被 KeepAlive 的组件，这个需要被 KeepAlive 的组件称为 “内部组件”。KeepAlive 组件会对 “内部组件” 进行操作，主要是在 “内部组件” 的 vnode 对象上添加一些标记属性，以便渲染器能够据此执行特定的逻辑。这些标记属性包裹如下几个：

   1.1 **shouldKeepAlive：**

   该属性会被添加到 “内部组件” 的 vnode 对象上，这样当渲染器卸载 “内部组件” 时，可以得知 “内部组件” 需要被 KeepAlive。于是，渲染器不会真的卸载 “内部组件”，而是会调用 _deActivate 函数完成搬运工作，如下面的代码所示：

   ```javascript
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
   ```
   1.2 **keepAliveInstance：**

   “内部组件” 的 vnode 对象会持有 KeepAlive 组件实例，在 unmount 函数中会通过 KeepAliveInstance 来访问 _deActivate 函数。

   1.3 **KeptAlive：**

   ”内部组件“ 如果已被缓存，还会为其添加一个 keptAlive 标记。这样当 ”内部组件“ 需要重新渲染时，渲染器不会重新挂载它，而会将其激活，如下面 patch 函数的代码所示：

   ```javascript
   function patch(n1, n2, container, anchor) {
     if (n1 && n1.type !== n2.type) {
       unmount(n1)
       n1 = null
     }

     const {type} = n2
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
   ```
2. KeepAlive 组件需要的move函数是由渲染器注入的，如下面 mountComponent 的代码所示：

   ```javascript
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
   ```
3. KeepAlive 组件的 include 和 exclude选项，代表哪些组件可以被缓存，如下面 KeepAlive 组件的实现代码所示：

   ```javascript
   const KeepAlive = {
    props: {
      include: RegExp,
      exclude: RegExp
    },
    setup(props, { slots }) {
      return () => {
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
      }
    }
   }
   ```
4. KeepAlive 的缓存管理

   先看下 KeepAlive 关于缓存的实现：

   ```javascript
   const cachedVNode = cache.get(rawVNode.type) // 获取缓存的组件
    if (cachedVNode) {
      // 如果缓存存在，则无需重新创建组件实例，只需要继承即可
      rawVNode.component = cachedVNode.component
      rawVNode.keptAlive = true // 标识组件已经被缓存，避免重新渲染
    } else {
      cache.set(rawVNode.type, rawVNode)
    }
   ```
   如果缓存存在，则继承组件实例，并将用于描述组件的 vnode 对象标记为 keptAlive，这样渲染器就不会重新创建新的组件实例；

   如果缓存不存在，则设置缓存。

   但是缓存是有上限的，KeepAlive 用 max 属性来设置 “最大缓存实例数，Vue3 内部用 LRU 算法实现了这个功能。

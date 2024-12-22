// Teleport 组件的使用方法

// 父组件
{
  <template>
    <div id="box" style="z-index: 1">
      <Overlay />
    </div>
  </template>
}

// 子组件
{
  <template>
    <Teleport to="body">
      <h1>Title</h1>
      <p>content</p>
    </Teleport>
  </template>

  function render() {
    return {
      type: Teleport,
      children: [
        { type: 'h1', children: 'Title' },
        { type: 'p', children: 'content' }
      ]
    }
  }
}




// Teleport 组件的定义
const Teleport = {
  __isTeleport: true, // 代表Teleport组件
  // process函数用于处理渲染逻辑
  process(n1, n2, container, anchor, internals) {
    const { patch } = internals
    // 旧节点不存在，说明是全新的挂载
    if (!n1) {
      // 获取容器，即挂载点
      const target = typeof n2.props.to === 'string'
        ? document.querySelector(n2.props.to)
        : n2.props.to
      // 把Teleport组件的子节点渲染到容器中
      n2.children.forEach(c => patch(null, c, target, anchor))
    } else {
      // 对于单纯的子节点的更新，用 patchChildren 函数进行更新即可
      patchChildren(n1, n2, container)
      // 如果新旧 to 属性的值不同，则需要对内容进行移动
      if (n2.props.to !== n1.props.to) {
        // 获取新的容器
        const newTraget = typeof n2.props.to === 'string'
          ? document.querySelector(n2.props.to)
          : n2.props.to
        // 移动到新的容器
        n2.children.forEach(c => move(c, newTraget))
      }
    }
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
  } else if (typeof type === 'object' && type.__isTeleport) {
    // 组件选项中如果存在 __isTeleport 标识，则它是 Teleport 组件
    // 调用 Teleport 组件选项中的 process 函数将控制权交接出去
    // 传递给 process 函数的第五个参数是渲染器的一些内部方法
    type.process(n1, n2, container, anchor, {
      patch,
      patchChildren,
      unmount,
      move(vnode, container, anchor) {
        IntersectionObserverEntry(vnode.component ? vnode.component.subTree.el : vnode.el, container, anchor)
      }
    })
  } else if (typeof type === 'object' || typeof type === 'function') {
    // ...
  }
}
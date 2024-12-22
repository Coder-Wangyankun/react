// 实现 Transition 组件
const Transition = {
  name: 'Transition',
  setup(props, { slots }) {
    return () => {
      // 通过默认插槽获取需要过渡的元素
      const innerVNode = slots.default() 

      // 在过渡元素的 VNode 对象上添加 transition 相应的钩子函数
      innerVNode.transition = {
        beforeEnter(el) {
          // 设置初始状态
          el.classList.add('enter-from')
          el.classList.add('enter-active')
        },
        enter(el) {
          // 在下一帧切换到结束状态
          nextFrame(() => {
            el.classList.remove('enter-from')
            el.classList.add('enter-to')
            
            // 监听 transitionend 事件，在过渡完成后，移除类名
            el.addEventListener('transitionend', () => {
              el.classList.remove('enter-to')
              el.classList.remove('enter-active')
            })
          })
        },
        leave(el, performRemove) {
          el.classList.add('leave-from')
          el.classList.add('leave-active')

          document.body.offsetHeight // 强制 reflow，使得初始状态生效

          nextFrame(() => {
            el.classList.remove('leave-from')
            el.classList.add('leave-to')
          })

          el.addEventListener('transitionend', () => {
            el.classList.remove('leave-to')
            el.classList.remove('leave-active')
            // 调用 performRemove 函数移除 DOM 元素
            performRemove()
          })
        }
      }

      return innerVNode
    }
  }
}

function mountElement(vnode, container, anchor) {
  const needTransition = vnode.transition // 判断一个 VNode 是否需要过渡
  if (needTransition) {
    // 调用 transition 的 beforeEnter 钩子函数
    vnode.transition.beforeEnter(el)
  }

  insert(el, container, anchor) // 挂载 DOM

  if (needTransition) {
    // 调用 transition 的 enter 钩子函数
    vnode.transition.enter(el)
  }
}

function unmount(vnode) {
  const needTransition = vnode.transition // 判断一个 VNode 是否需要过渡

  const parent = vnode.el.parentNode
  if (parent) {
    // 将卸载动作封装到 performRemove 函数中
    const performRemove = () => parent.removeChild(vnode.el)
    if (needTransition) {
      // 如果需要过渡处理，则调用 transition.leave 钩子
      vnode.transition.leave(vnode.el, performRemove)
    } else {
      // 如果不需要过渡处理，则直接执行卸载操作
      performRemove()
    }
  }
}
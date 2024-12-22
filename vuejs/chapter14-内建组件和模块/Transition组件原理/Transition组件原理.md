# 了解原生 DOM 的过渡动画阶段

一共有 6 个 class 类，4 个动画阶段

* beforeEnter 阶段：发生在创建 DOM —— 挂载 DOM之间
  添加 enter-from 和 enter-active 类（也就是设置进场的初始状态）
* enter 阶段：发生在挂载 DOM 之后
  在下一帧中移除 enter-from 类，添加 enter-to 类（执行进场动画）
* 进场动效结束：
  移除 enter-to 和 enter-active 类
* beforeLeave 阶段：发生在移除 DOM 之前
  添加 leave-from 和 leave-active 类（也就是设置离场的初始状态）
* leave阶段：发生在移除 DOM 之后
  在下一帧中移除 leave-from 类，添加 leave-to 类（执行出场动画）

# 实现 Transition 组件

1. Transition 组件本身不会渲染任何额外的内容，它只是通过默认插槽读取过渡元素，并渲染需要过渡的元素。
2. Transition 组件的作用，就是在过渡元素的虚拟节点上添加 transition 相关的钩子函数。
   如下面的代码所示：

```javascript
  const Transition = {
    name: 'Transition',
    setup(props, { slots }) {
      return () => {
        // 通过默认插槽获取需要过渡的元素
        const innerVNode = slots.default() 

        // 在过渡元素的 VNode 对象上添加 transition 相应的钩子函数
        innerVNode.transition = {
          beforeEnter(el) {
        
          },
          enter(el) {

          },
          leave(el, performRemove) {
            // 调用 performRemove 函数移除 DOM 元素
            performRemove()
          }
        }

        return innerVNode
      }
    }
  }
```

3. 渲染器在渲染需要过渡的虚拟节点时，会在合适的时机调用附加到该虚拟节点上的过渡相关的生命周期钩子函数，所以需要渲染函数比如 mountElement 和 unmount 对过渡相关的生命周期钩子函数提供支持，如下面的代码所示：

```javascript
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
```

4. 在有了 mountElement 函数和 unmount 函数的支持后，可以实现一个最基本的 transition 组件了，如下面的代码所示：

```javascript
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
```

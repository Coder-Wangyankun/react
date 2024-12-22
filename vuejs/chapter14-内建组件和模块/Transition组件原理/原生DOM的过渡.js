// 1. 了解原生DOM进场和离场的过渡效果
const el = document.createElement('div')
el.classList.add('box')

// 创建DOM —— 挂载DOM过程中
el.classList.add('enter-form')
el.classList.add('enter-active')

document.body.appendChild(el)

requestAnimationFrame(() => {
  // 挂载DOM后
  el.classList.remove('enter-form')
  el.classList.add('enter-to')

  el.addEventListener('transitionend', () => {
    el.classList.remove('enter-to')
    el.classList.add('enter-active')
  })
})

// 点击元素的时候，卸载元素
el.addEventListener('click', () => {
  // 封装卸载函数
  const performRemove = () => el.parentNode.removeChild(el)

  el.classList.add('leave-from')
  el.classList.add('leave-active')

  document.body.offsetHeight // 强制 reflow，使得初始状态生效

  requestAnimationFrame(() => {
    el.classList.remove('leave-from')
    el.classList.add('leave-to')

    el.addEventListener('transitionend', () => {
      el.classList.remove('leave-to')
      el.classList.remove('leave-active')
      // 当过渡完成后，记得调用 performRemove 函数将 DOM 元素移除
      performRemove()
    })
  })
})

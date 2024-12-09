const vnode = {
  tag: 'div',
  props: {
    onClick: () => {
      console.log('hello div')
    }
  },
  children: 'div'
}

const MyComponent = () => {
  return {
    tag: 'div',
    props: {
      onClick: () => {
        console.log('hello div')
      }
    },
    children: 'div'
  }
}
const vnode1 = {
  tag: MyComponent
}

const renderer = (vnode, container) => {
  if (typeof vnode.tag === 'string') {
    mountElement(vnode, container)
  } else if (typeof vnode.tag === 'function') {
    mountComponent(vnode, container)
  }
}

const mountElement = (vnode, container) => {
  const el = document.createElement(vnode.tag)
  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      const eventName = key.slice(2).toLowerCase()
      el.addEventListener(eventName, vnode.props[key])
    }
  }
  if (typeof vnode.children === 'string') {
    const text = document.createTextNode(vnode.children)
    el.appendChild(text)
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => renderer(child, el))
  }
  container.appendChild(el)
}

const mountComponent = (vnode, container) => {
  const subtree = vnode.tag()
  renderer(subtree, container)
}

renderer(vnode, document.body)
renderer(vnode1, document.body)
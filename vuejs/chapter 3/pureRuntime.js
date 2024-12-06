const obj = {
  tag: 'div',
  children: [
    {
      tag: 'span',
      children: 'hello world'
    }
  ]
}

const render = (vdom, container) => {
  const el = document.createElement(vdom.tag)
  if (typeof vdom.children === 'string') {
    const text = document.createTextNode(vdom.children)
    el.appendChild(text)
  } else {
    vdom.children.forEach(child => render(child, el))
  }
  container.appendChild(el)
}

render(obj, document.body)
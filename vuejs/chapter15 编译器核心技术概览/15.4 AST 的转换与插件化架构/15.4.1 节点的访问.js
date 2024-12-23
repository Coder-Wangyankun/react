function parse(str) {
  // 首先对模板进行标记化，得到 tokens

  // const tokens = tokenize(str)
  // 这里没有写 tokenize 函数，假设已经实现了
  // tokens 的 mock 数据
  const tokens = [
    { type: "tag", name: "div" }, // div 开始标签节点
    { type: "tag", name: "p" }, // p 开始标签节点
    { type: "text", content: "Vue" }, // 文本节点
    { type: "tagEnd", name: "p" }, // p 结束标签节点
    { type: "tag", name: "p" }, // p 开始标签节点
    { type: "text", content: "Template" }, // 文本节点
    { type: "tagEnd", name: "p" }, // p 结束标签节点
    { type: "tagEnd", name: "div" } // div 结束标签节点
  ]

  // 创建 Root 根节点
  const root = {
    type: 'Root',
    children: []
  }
  // 创建 elementStack 栈，起初只有 Root 根节点
  const elementStack = [root]

  // 开启一个 while 循环扫描 tokens，直到所有 Token 都被扫描完毕为止
  while (tokens.length) {
    // 获取当前栈顶节点作为父节点 parent
    const parent = elementStack[elementStack.length - 1]
    // 当前扫描的 Token
    const t = tokens[0]
    switch (t.type) {
      case 'tag':
        // 如果当前 Token 是开始标签，则创建 Element 类型的 AST 节点
        const elementNode = {
          type: 'Element',
          tag: t.name,
          children: []
        }
        // 将其添加到父级节点的 children 中
        parent.children.push(elementNode)
        // 将当前节点压入栈
        elementStack.push(elementNode)
        break
      case 'text':
        // 如果当前 Token 是文本，则创建 Text 类型的 AST 节点
        const textNode = {
          type: 'Text',
          content: t.content
        }
        // 将其添加到父节点的 children 中
        parent.children.push(textNode)
        break
      case 'tagEnd':
        // 遇到结束标签，将栈顶节点弹出
        elementStack.pop()
        break
    }
    // 消费已经扫描过的 token
    tokens.shift()
  }

  // 最后返回 AST
  return root
}

function dump(node, indent = 0) {
  // 节点的类型
  const type = node.type
  // 节点的描述，如果是根节点，则没有描述
  // 如果是 Element 类型的节点，则使用 node.tag 作为节点的描述
  // 如果是 Text 类型的节点，则使用 node.content 作为节点的描述
  const desc = node.type === 'Root'
    ? ''
    : node.type === 'Element'
      ? node.tag
      : node.content

  // 打印节点的类型和描述信息
  console.log(`${'-'.repeat(indent)}${type}: ${desc}`)

  // 递归地打印子节点
  if (node.children) {
    node.children.forEach(n => dump(n, indent + 2))
  }
}

function transform(ast) {
  // 在 transform 函数内创建 context 对象
  const context = {
    // 注册 nodeTransforms 数组
    nodeTransforms: [
      transformElement, // transformElement 函数用来转换标签节点
      transformText // transformText 函数用来转换文本节点
    ]
  }
  // 调用 traverseNode 完成转换
  traverseNode(ast, context)
  // 打印 AST 信息
  console.log(dump(ast))
}

// 接收第二个参数 context
function traverseNode(ast, context) {
  const currentNode = ast

  // context.nodeTransforms 是一个数组，其中每一个元素都是一个函数
  const transforms = context.nodeTransforms
  for (let i = 0; i < transforms.length; i++) {
    // 将当前节点 currentNode 和 context 都传递给 nodeTransforms 中注册的回调函数
    transforms[i](currentNode, context)
  }

  const children = currentNode.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      traverseNode(children[i], context)
    }
  }
}

// 把 p 标签转换成 h1 标签
function transformElement(node) {
  if (node.type === 'Element' && node.tag === 'p') {
    node.tag = 'h1'
  }
}

// 把文本节点中的内容重复两次
function transformText(node) {
  if (node.type === 'Text') {
    node.content = node.content.repeat(2)
  }
}


const ast = parse(`<div><p>Vue</p><p>Template</p></div>`)
console.log('转换前的 AST 信息：')
dump(ast)
console.log('转换后的 AST 信息：')
transform(ast)
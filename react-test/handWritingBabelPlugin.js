import Babel from '@babel/core'
import fs from 'node:fs'
const file = fs.readFileSync('./handWritingBabelPluginTest.js', 'utf-8')
// 参数通常是 { types: t, generate, template } ，通常使用types，简写为t
const transformArrowFunction = ({types: t}) => {
  return {
    name: 'babel-transform-arrow-function', // 插件名
    visitor: {
      // 匹配箭头函数
      ArrowFunctionExpression(path) {
        const node = path.node
        // console.log(node) // 调试的时候可以使用log
        const simpleFunction = t.functionExpression(
          null, // node.id 是一个 Identifier 节点，表示函数名
          node.params, // node.params 是一个数组，表示函数的参数
          // BlockStatement 是 JavaScript 抽象语法树（AST）中的一种节点类型，表示一个由大括号 {} 包围的语句块。它是函数体、循环体、条件分支（如 if 语句）等代码块的基础结构
          // node.body 是函数的主体，通常是一个 BlockStatement 节点
          t.blockStatement([t.returnStatement(node.body)]),
          node.async // node.async 是一个布尔值，表示函数是否是异步的 (async 函数)
        )
        // 用普通函数替代当前节点
        path.replaceWith(simpleFunction)
      }
    }
  }
}
const result = Babel.transform(file, {
  plugins: [transformArrowFunction]
})
console.log(result.code)
import Babel from '@babel/core'
import presetEnv from '@babel/preset-env'
import reactPreset from '@babel/preset-react'
import fs from 'node:fs'
const file = fs.readFileSync('./app.jsx', 'utf-8')
const result = Babel.transform(file, {
  presets: [
    //usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
    //corejs 3 是corejs的版本
    [presetEnv, { useBuiltIns: 'usage', corejs: 3 }],
    reactPreset
  ]
})
console.log(result.code)
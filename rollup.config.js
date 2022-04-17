const path = require('path')
const ts = require('rollup-plugin-typescript2')
const resolvePlugin = require('@rollup/plugin-node-resolve').default


// 1. 获取整个 packages 目录
const packagesDir = path.resolve(__dirname, 'packages');

// 根据调用 rollup 时候的参数来进行动态打包， 找到具体要打包哪个模块
const name = process.env.TARGET
const packageDir = path.resolve(packagesDir, name)

const currentResolve = p => path.resolve(packageDir, p)

// 拿到 package.json 中的内容
const pkg = require(currentResolve('package.json'));
const options = pkg.buildOptions

const outputConfig = {
  cjs: {
    file: currentResolve(`dist/${name}.cjs.js`),
    format: 'cjs'
  },
  global: {
    file: currentResolve(`dist/${name}.global.js`),
    format: 'iife'
  },
  'esm-bundler': {
    file: currentResolve(`dist/${name}.esm-bundler.js`),
    format: 'esm'
  },
}

// rollup 的配置可以返回一个数组

function createConfig(output) {
  output.name = options.name// global 模式的话， 必须加 name 选项
  output.sourcemap = true; // 添加 sourcemap ,tsconfig.json 中的 sourcemap 也要打开
  return {
    input: currentResolve('src/index.ts'),
    output,
    plugins: [
      // 这两个插件的顺序不能改变， 先解析ts 再解析文件后缀
      ts({
        tsconfig: path.resolve(__dirname, 'tsconfig.json')
      }),
      resolvePlugin()
    ]
  }
}

export default options.formats.map(f => createConfig(outputConfig[f]))


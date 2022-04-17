根据自定义配置，打出不同模式的包

```json
"buildOptions": {
  "name": "VueShared",
  "formats": [
  "cjs", // module.exports
  "esm-bundler", // export default
  "global" // window.xxx
  ]
},
```

npm i rollup typescript rollup-plugin-typescript2 @rollup/plugin-node-resolve (引入文件时不用加后缀) execa (单独开启一个进程进行打包)-D

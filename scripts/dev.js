/**
 * 1. 拿到 packages 下的所有包
 */

 const fs = require('fs');
 const execa = require('execa'); // 单独开启一个进程进行打包,  6.1.0 的版本是 esm 不能用 require, 将版本降到 4.1.0
 
 const target = 'reactivity'
 
//  const targets = fs.readdirSync('packages').filter(item => {
//    // 判断文件或文件夹的状态
//    return fs.statSync(`packages/${item}`).isDirectory()
//  })
 
 async function build(target) {
   console.log(target);
   return execa('rollup', ['-cw', '--environment', `TARGET:${target}`], {
     stdio: 'inherit' // 表示子进程中得输出结果会输出到父进程中
   } )
 }

 build(target)
 
//  function runAll(targets) {
//    const result = []
//    for (const target of targets) {
//      result.push(build(target))
//    }
//    return Promise.all(result); // 多个文件并行打包
//  }
 
 
//  // 打包这些文件
//  runAll(targets).then(() => {
//    console.log('打包完毕');
//  })
 
//  console.log(targets);
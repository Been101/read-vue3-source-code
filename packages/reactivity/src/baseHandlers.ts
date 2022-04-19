import { extend } from "@vue/shared";
import { reactive, readonly } from "./reactive";

const get = createGetter();
const readonlyGet = createGetter(true); // 仅读的
const shallowGet = createGetter(false, true); // 非仅读， 浅的
const shallowReadonlyGet = createGetter(true, true); // 仅读， 浅的
const set = createSetter();

// 响应式原理的核心在依赖收集
const readonlySet = {
  set(target, key) {
    console.warn(`cannot set on ${key}, readonly!!!`)
  }
}

function createGetter(isReadonly = false, shallow = false) {
  // 取值的时候第一个是目标， 第二个是属性。 第三个是代理对象
  return function get(target, key, receiver) {
    console.log(target, key, receiver);
    
    // proxy 和 reflect 一般情况下会联合使用
    // 依赖收集
    const res = Reflect.get(target, key, receiver)

    if(!isReadonly) { // 如果对象是一个仅读的属性，那就意味着这个对象不可能被更改， 不可能更新视图， 不需要增条依赖收集
      // 不是仅读的采取收集依赖
    }

    if(shallow) {
      return res; // 如果是浅的说明不需要递归代理
    }

    // 如果是对象， 就递归代理，但是不是一开始就代理，是在用到这个对象的时候才进行代理
    return isReadonly ? readonly(res): reactive(res); // 取值的时候再去代理 (懒代理)
  }
}

function createSetter() {
  return function set(target, key, value, receiver) { // value 是设置的值， 其他一样
    const res = Reflect.set(target, key, value, receiver); // 和 target[key] = value 类似


    // 触发视图更新， 做处理

    console.log('设置值', key, value);

    return res;
  }
}


export const mutableHandlers = {
  get,
  set
}
export const shallowReactiveHandlers = {
  get:  shallowGet,
  set
}
export const readonlyHandlers =extend ({
  get:  readonlyGet
}, readonlySet)
export const shallowReadonlyHandlers = extend({
  get:  shallowReadonlyGet
}, readonlySet)
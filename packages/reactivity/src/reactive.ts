import { isObject } from '@vue/shared';
import { mutableHandlers, shallowReactiveHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers';

const reactiveMap = new WeakMap(); // 对象{}的Key不能用对象，弱'引用'。 map 的 key 是可以用对象的。 weakMap 中的 key 只能是对象，如果引用的 key 被置为 null ,weakmap 会自行自动回收
const readonlyMap = new WeakMap()
const shallowReactiveMap = new WeakMap()
const shallowReadonlyMap = new WeakMap()

export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
} 
export function shallowReactive(target: object) {
  return createReactiveObject(target, shallowReactiveHandlers, shallowReactiveMap)
} 
export function readonly(target: object) {
  return createReactiveObject(target, readonlyHandlers, readonlyMap)
} 
export function shallowReadonly(target: object) {
  return createReactiveObject(target, shallowReadonlyHandlers, shallowReadonlyMap)
} 


// 以上4个方法最终使用的都是这一个方法，这个方法会根据参数的不同来进行不同的处理
export function createReactiveObject(target, baseHandlers, proxyMap) {
  // 是不是对象
  if(!isObject(target)) {
    return target
  }

  // 创建代理对象返回。 做缓存， 不要重复代理
  const existsProxy = proxyMap.get(target)
  if(existsProxy) {
    return existsProxy
  }
  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)

  return proxy
}
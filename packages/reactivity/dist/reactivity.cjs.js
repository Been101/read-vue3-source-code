'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isObject = val => typeof val === 'object' && val !== null;
const extend = Object.assign;

const get = createGetter();
const readonlyGet = createGetter(true); // 仅读的
const shallowGet = createGetter(false, true); // 非仅读， 浅的
const shallowReadonlyGet = createGetter(true, true); // 仅读， 浅的
const set = createSetter();
// 响应式原理的核心在依赖收集
const readonlySet = {
    set(target, key) {
        console.warn(`cannot set on ${key}, readonly!!!`);
    }
};
function createGetter(isReadonly = false, shallow = false) {
    // 取值的时候第一个是目标， 第二个是属性。 第三个是代理对象
    return function get(target, key, receiver) {
        console.log(target, key, receiver);
        // proxy 和 reflect 一般情况下会联合使用
        // 依赖收集
        const res = Reflect.get(target, key, receiver);
        if (shallow) {
            return res; // 如果是浅的说明不需要递归代理
        }
        // 如果是对象， 就递归代理，但是不是一开始就代理，是在用到这个对象的时候才进行代理
        return isReadonly ? readonly(res) : reactive(res); // 取值的时候再去代理 (懒代理)
    };
}
function createSetter() {
    return function set(target, key, value, receiver) {
        const res = Reflect.set(target, key, value, receiver); // 和 target[key] = value 类似
        // 触发视图更新， 做处理
        console.log('设置值', key, value);
        return res;
    };
}
const mutableHandlers = {
    get,
    set
};
const shallowReactiveHandlers = {
    get: shallowGet,
    set
};
const readonlyHandlers = extend({
    get: readonlyGet
}, readonlySet);
const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet
}, readonlySet);

const reactiveMap = new WeakMap(); // 对象{}的Key不能用对象，弱'引用'。 map 的 key 是可以用对象的。 weakMap 中的 key 只能是对象，如果引用的 key 被置为 null ,weakmap 会自行自动回收
const readonlyMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();
function reactive(target) {
    return createReactiveObject(target, mutableHandlers, reactiveMap);
}
function shallowReactive(target) {
    return createReactiveObject(target, shallowReactiveHandlers, shallowReactiveMap);
}
function readonly(target) {
    return createReactiveObject(target, readonlyHandlers, readonlyMap);
}
function shallowReadonly(target) {
    return createReactiveObject(target, shallowReadonlyHandlers, shallowReadonlyMap);
}
// 以上4个方法最终使用的都是这一个方法，这个方法会根据参数的不同来进行不同的处理
function createReactiveObject(target, baseHandlers, proxyMap) {
    // 是不是对象
    if (!isObject(target)) {
        return target;
    }
    // 创建代理对象返回。 做缓存， 不要重复代理
    const existsProxy = proxyMap.get(target);
    if (existsProxy) {
        return existsProxy;
    }
    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}

exports.reactive = reactive;
exports.readonly = readonly;
exports.shallowReactive = shallowReactive;
exports.shallowReadonly = shallowReadonly;
//# sourceMappingURL=reactivity.cjs.js.map

/**
 * iDrome — Proxy 响应式 Store
 *
 * 按设计方案第 31.3 节实现：
 * - createStore(initialState) 函数
 * - makeReactive(obj) 递归 Proxy（含 __isReactive 标记）
 * - get 拦截器：对象/数组递归代理
 * - set 拦截器：值变化时通知订阅者
 * - subscribe(fn) 订阅方法
 *
 * 数组操作建议使用展开赋值模式：
 *   state.conversations = [...state.conversations, newConv]
 * 而非 state.conversations.push(newConv)
 */

'use strict'

/**
 * 创建响应式状态 Store
 * @param {Object} initialState - 初始状态
 * @returns {{ state: Object, subscribe: Function }} 状态对象和订阅方法
 */
export function createStore(initialState) {
  const listeners = new Set()

  // 递归代理嵌套对象（深层响应式）
  const makeReactive = (obj) => {
    // 非对象类型或 null 直接返回
    if (!obj || typeof obj !== 'object') return obj

    // 已代理过的对象直接返回
    if (obj.__isReactive) return obj

    return new Proxy(obj, {
      get(target, key) {
        // __isReactive 标记，用于检测是否已被代理
        if (key === '__isReactive') return true

        const val = target[key]

        // 对象和数组类型递归代理，实现深层响应式
        if (val && typeof val === 'object' && !val.__isReactive) {
          return makeReactive(val)
        }
        return val
      },
      set(target, key, value) {
        const oldValue = target[key]
        target[key] = value
        // 值变化时通知所有订阅者（传递 target, key, newValue, oldValue）
        if (oldValue !== value) {
          listeners.forEach(fn => fn(target, key, value, oldValue))
        }
        return true
      },
      deleteProperty(target, key) {
        const hadKey = key in target
        const oldValue = target[key]
        const result = Reflect.deleteProperty(target, key)
        if (hadKey && result) {
          listeners.forEach(fn => fn(target, key, undefined, oldValue))
        }
        return result
      }
    })
  }

  const state = makeReactive(initialState)

  return {
    state,
    /**
     * 订阅状态变化
     * @param {Function} fn - 回调函数 (target, key, newValue, oldValue)
     * @returns {Function} 取消订阅函数
     */
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    }
  }
}

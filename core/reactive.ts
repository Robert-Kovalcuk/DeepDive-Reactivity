import {getActiveEffect, schedule, requestFlush, EffectFn} from "./index.js"

function reactive<T extends object>(obj: T) {
    const _deps = new Map<string | symbol, Set<EffectFn<T>>>()

    return new Proxy<T>(obj, {
        set(target, propKey, newValue, receiver) {
            const hasSet = Reflect.set(target, propKey, newValue, receiver)

            if(_deps.has(propKey)) {
                _deps.get(propKey)?.forEach(eff => schedule(eff))
                requestFlush()
            }

            return hasSet
        },

        get(target, propKey, receiver) {
            const activeEffect = getActiveEffect<T>()

            if(activeEffect) {
                if(!_deps.has(propKey)) {
                    _deps.set(propKey, new Set())
                }
                _deps.get(propKey)?.add(activeEffect)
            }

            return Reflect.get(target, propKey, receiver)
        },
    })
}

export {reactive}
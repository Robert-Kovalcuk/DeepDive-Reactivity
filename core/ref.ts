import {getActiveEffect, schedule, requestFlush, EffectFn} from "./index.js"

interface Ref<T> {
    value: T
}

function ref<T extends number | string>(initialValue: T) {
    const _deps = new Set<EffectFn<T>>()
    let _cache = initialValue

    function downstream() {
        _deps.forEach(d => schedule(d))
    }

    return {
        get value() {
            const activeEffect = getActiveEffect<T>()

            if (activeEffect) {
                _deps.add(activeEffect)
            }

            return _cache;
        },

        set value(newValue) {
            _cache = newValue
            downstream()
            requestFlush()
        }
    };
}

export {ref, Ref}
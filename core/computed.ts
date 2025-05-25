import {effect} from "./effect.js"
import {getActiveEffect, schedule, requestFlush, EffectFn} from "./index.js"

interface Computed<T> {
    readonly value: T
}

function computed<T>(getterFn: EffectFn<T>) {
    let _deps= new Set<EffectFn<T>>()
    let _cache: T

    const computedObj = {
        get value(): T {
            const activeEffect = getActiveEffect<T>()

            if(activeEffect) {
                _deps.add(activeEffect)
            }

            return _cache
        }
    }

    effect(getterFn.toString(), () => {
        const _upstreamData = upstream()

        if(_upstreamData !== _cache) {
            _cache = _upstreamData
            downstream()
            requestFlush()
        }

        return _cache
    })

    function downstream() {
        _deps.forEach(d => schedule(d))
    }

    function upstream() {
        return getterFn()
    }

    return Object.freeze(computedObj)
}

export {computed, Computed}
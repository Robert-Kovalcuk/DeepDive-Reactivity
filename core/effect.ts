import {setActiveEffect, getActiveEffect, EffectFn, EffectId} from "./index.js"

function effect(id: EffectId, fn: EffectFn<unknown>): void {
    setActiveEffect(fn)

    try {
        const effect = getActiveEffect()
        if(effect)
            effect()
    } finally {
        setActiveEffect(null)
    }
}

export {effect}
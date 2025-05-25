let activeEffect: EffectFn<any> | null = null

export type EffectId = string
export type EffectFn<T> = () => T

function getActiveEffect<T>(): EffectFn<T> | null       {return activeEffect}
function setActiveEffect<T>(effect: EffectFn<T> | null) {activeEffect = effect}

export {getActiveEffect, setActiveEffect}
export {effect} from "./effect.js"
export {requestFlush, schedule} from "./scheduler.js"
export {ref} from "./ref.js"
export {reactive} from "./reactive.js"
export {computed} from "./computed.js"
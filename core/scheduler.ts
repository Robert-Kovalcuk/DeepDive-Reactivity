import {EffectFn} from "./index.js"

const taskQueue = new Set<EffectFn<unknown>>()
let isFlushPending = false

function schedule(effect: EffectFn<unknown>) {
    taskQueue.add(effect)
}

function flush() {
    taskQueue.forEach((effect: EffectFn<unknown>) => {
        try {
            effect()
        } catch (e) {
            console.error(`Scheduler error: executing effect ${effect}`)
        }
    })

    taskQueue.clear()
    isFlushPending = false
}

function requestFlush(): void {
    if(!isFlushPending) {
        isFlushPending = true
        Promise.resolve().then(flush)
    }
}

export {
    schedule,
    requestFlush
}
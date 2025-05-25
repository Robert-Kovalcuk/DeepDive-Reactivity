# CoreTS-Reactivity: A TypeScript-Powered Standalone Reactivity System

## 🚀 Introduction

Core-Reactivity is a standalone reactivity system built from scratch using TypeScript. This project was undertaken as a deep dive into the fundamental mechanics of modern frontend frameworks like Vue.js, aiming to understand and implement core concepts such as Proxy-based reactivity, dependency tracking, computed properties, reactive references, and efficient update batching via a microtask-based scheduler.

The primary motivation is educational: to deconstruct and rebuild these complex patterns to achieve a high understanding of JavaScript, TypeScript, and framework **internals**.

## ✨ Features

*   **`reactive(obj)`:** Creates deeply reactive objects using JavaScript `Proxy`. Changes to properties automatically trigger dependent effects.
*   **`ref(initialValue)`:** Creates reactive references, typically for primitive values, accessible and modifiable via a `.value` property.
*   **`computed(getterFn)`:** Creates derived reactive values that are intelligently cached and only re-evaluate when their underlying reactive dependencies change.
*   **`effect(id, fn)`:** Registers a function to run immediately and then re-run automatically whenever its tracked reactive dependencies are updated.
*   **Microtask-Based Scheduler:** Ensures efficient updates by batching multiple synchronous state changes into a single update cycle, processed in the microtask queue.
*   **Type-Safe:** Written entirely in TypeScript with strict typing for improved robustness, maintainability, and developer experience.
*   **Modular Design:** Core functionalities are organized into distinct, well-defined modules.

## 🛠️ API Overview & Usage Examples

To use the library, import the necessary functions from the core entry point:

```typescript
import { reactive, ref, computed, effect } from './core'; // Adjust path as needed

const count = ref(0);
const message = ref('Hello');

effect('logCount', () => {
  console.log(`Count is: ${count.value}`);
});
// Output: Count is: 0

count.value++; // Update the ref's value
// After microtask flush, Output: Count is: 1

message.value = 'World';
// (If an effect depends on message, it would also re-run)
```

```typescript

const user = reactive({
  firstName: 'John',
  lastName: 'Doe',
  address: {
    street: '123 Main St',
    city: 'Anytown'
  }
});

effect('logUser', () => {
  console.log(`User: ${user.firstName} ${user.lastName}, City: ${user.address.city}`);
});
// Output: User: John Doe, City: Anytown

user.firstName = 'Jane';
user.address.city = 'Newville';
// After microtask flush, Output: User: Jane Doe, City: Newville
```
```typescript

const num1 = ref(5);
const num2 = ref(10);

const sum = computed(() => {
  console.log('COMPUTED: Calculating sum...');
  return num1.value + num2.value;
});

effect('logSum', () => {
  console.log(`Sum is: ${sum.value}`);
});
// Output:
// COMPUTED: Calculating sum...
// Sum is: 15

console.log(`Current sum: ${sum.value}`); // Accesses cached value
// Output: Current sum: 15 (no "Calculating sum..." log)

num1.value = 7;
// After microtask flush:
// COMPUTED: Calculating sum...
// Sum is: 17
```
```typescript

const isActive = ref(true);
const data = reactive({ value: 'Initial Data' });

effect('statusLogger', () => {
  if (isActive.value) {
    console.log(`Data value is: ${data.value}`);
  } else {
    console.log('Effect is inactive.');
  }
});
// Output: Data value is: Initial Data

data.value = 'Updated Data';
// After microtask flush, Output: Data value is: Updated Data

isActive.value = false;
// After microtask flush, Output: Effect is inactive.
```

## ⚙️ Internal Workings (High-Level)

## Dependency Tracking:

reactive: Utilizes Proxy traps (get and set) to detect property access and mutation. When a property is accessed within an active effect, that effect is registered as a dependency for the property.

ref: Uses getter/setter pairs on its .value property to track and trigger dependencies.

computed: Internally uses an effect to track dependencies of its getter function. When these dependencies change, the computed value is re-evaluated and its own dependents are notified.

## Scheduler:

When reactive state changes, dependent effects are not run immediately. Instead, they are added to a unique queue.

A single "flush" operation for this queue is scheduled as a microtask using Promise.resolve().then().

This ensures all synchronous changes in an event loop tick are processed, and effects are run only once with the final state, preventing redundant computations and layout thrashing.

TypeScript:

The entire system is built with TypeScript, employing generics, interfaces, and strict type checking to ensure type safety, improve code clarity, and enhance maintainability.

## 📂 Project Structure (Core)

The core logic resides in the core/ directory:

**index.ts:** The main barrel file, exporting the public API and managing shared internal state like activeEffect.

**reactive.ts:** Implementation for reactive().

**ref.ts:** Implementation for ref().

**computed.ts:** Implementation for computed().

**effect.ts:** Implementation for effect().

**scheduler.ts:** Logic for the microtask-based update scheduler.

import {computed, effect, ref} from "./dist/index.js";

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
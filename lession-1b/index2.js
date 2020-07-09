let animals = [
    { 'name': 'a', 'size': 'small' },
    { 'name': 'a', 'size': 'big' },
    { 'name': 'a', 'size': 'big' },
    { 'name': 'a', 'size': 'small' },
    { 'name': 'a', 'size': 'medium' },
    { 'name': 'a', 'size': 'small' },
    { 'name': 'a', 'size': 'medium' },
    { 'name': 'a', 'size': 'small' }
]

// let result = animals.reduce((a, b) => {
//     if (b.size == 'small') {
//         a++;
//     }
//     return a;
// }, 0);

let small = 0; let medium = 0; let big = 0;

let result = animals.map((value) => {
    if (value.size == 'small') {
        small++;
    }
    if (value.size == 'medium') {
        medium++;
    }
    if (value.size == 'big') {
        big++;
    }
})

console.log(small, big, medium);

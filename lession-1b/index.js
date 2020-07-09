let a = [1, 2, 5, 'nguyen hong quan', 6, 1212, 'Nguyen an'];

// let abc = a.filter((value, index) => {
//     return index % 2 == 1;
// });
// console.log(abc);

console.log(a.slice(2, 5));

let arr1 = [6,'son','girl' ,2, 5, 2];
let arr2 = [1, 2, 4, 2];

// function sosanh(arr1, arr2) {
//     let sum1 = arr1.reduce((a, b) => a + b, 0);
//     let sum2 = arr2.reduce((a, b) => a + b, 0);

//     if (sum1 == sum2) {
//         return true;
//     }
//     return false;
// }

// console.log(sosanh(arr1, arr2));
// console.log(arr1.filter((value) => isNaN (value)));
console.log(arr1.splice(1, 0,'a','bb'));

let str1 = 'Nguyen Quan Hong Quan Quan nguyen Quan';
let str2 = 'BACADAS';
// tim kiem vi tri cua gia tri truyen vao, thay the
while (str1.indexOf('Quan') != -1) {
    str1 = str1.replace('Quan' ,'QUAN');
}
console.log(str1);


// console.log(str1.toLowerCase().lastIndexOf('ng'));

// console.log(str1.search('ong'));

// console.log(str1.slice(1, 3));

// console.log(str1.substring(3, 1));

// console.log(str1.substr(-4, 2));

// console.log(str1.replace('Quan', 'Nguyen'));

// console.log(str1.split(' '));

// console.log(str1.concat(str2));

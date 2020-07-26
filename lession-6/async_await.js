let a = function () {
    setTimeout(() => {
        console.log(`Nguyen Hong Quan`);
    }, 1000);
};

async function callAsync() {
    await a();
    await function () {
        console.log("abc");
    }
}

callAsync();

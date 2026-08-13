

function checkNumber(number){
    return new Promise((resolve, reject) => {
        if(number >= 18) {
            resolve("Eligible");
        }else{
            reject("Not Eligible");
        }
    })
}



checkNumber(100)
.then((result) => {
    console.log(result);
})
.catch((err) => {
    console.log(err);
})

function calculate(a, b, operation, callback){
    let c ;

    if(operation === "add"){
        c = a  + b;
    }else if(operation === "multiply"){
        c = a * b;
    }else if(operation === "subtract"){
        c = a - b;
    }else{
        console.error("Operation not exists");
        return
    }

    callback(c);
}


function callback(result){
    console.log("Result : ", result);
}


calculate(10, 5, "add", callback);
calculate(10, 5, "multiply", callback);
calculate(10, 5, "subtract", callback);

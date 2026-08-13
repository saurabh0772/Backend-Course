

function getUser(callback){
    console.log("Getting User...");
    setTimeout(() => {
        console.log("User found.\n");
        callback()
    }, 1000)
}

function getOrders(callback){
    console.log("Getting orders...");
    setTimeout(() => {
        console.log("Orders found.\n");
        callback()
    }, 1000)
}

function getOrderDetails(callback){
    console.log("Getting order details...");
    setTimeout(() => {
        console.log("Order details found.\n");
        callback()
    }, 1000)
}


getUser( () => {
    getOrders( () => {
        getOrderDetails( () => {
            console.log("Process completed!");
        } )
    } )
} )
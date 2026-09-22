const data = {
    "Id" : 1,
    "UserId" : 2,
    "User" : "Saurabh",
    "Order" : 101,     
    "ProductId" : 1,   
    "Product" : "Node.js Course",
    "Reviews" : {
        "1" : "Very useful course",
        "2" : "Good explanations",
        "3" : "Great for beginners"
    }
}



function getUser(id, callback){
    
    setTimeout(() => {
        if(data["Id"] !== id){
            console.log("Id not found");
            return;
        }
        callback();
    }, 1000)
}

function getOrders(userId, callback){

    setTimeout(() => {
        if(data["UserId"] !== userId){
            console.log("User not found");
            return;
        }
        console.log("User : ", data["User"]);
        callback();
    }, 1000);

}

function getOrder(orderId, callback){

    setTimeout(() => {
        if(data["Order"] !== orderId){
            console.log("Order not found");
            return;
        }
        console.log("Order : #", data["Order"]);
        callback();
    }, 1000);

}

function getProduct(productId, callback){

    setTimeout(() => {
        if(data["ProductId"] !== productId){
            console.log("Product not found");
            return;
        }
        console.log("Product : ", data["Product"]);
        callback();
    }, 1000);

}

function  getReviews(productId){

    setTimeout(() => {
        console.log("Reviews : ", data["Reviews"]);
    }, 1000);

}


getUser(1, () => {
    getOrders(2, () => {
        getOrder(101, () => {
            getProduct(1, () => {
                getReviews(1);
            })
        })
    })
})


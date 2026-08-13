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


function getUser(id){
   return new Promise((resolve, reject) => {
        if(id !== data["Id"]){
            reject("id not found");
        }

        resolve(data["UserId"]);
   })
}

function getOrders(userId){
    return new Promise((resolve, reject) => {
        if(userId === undefined){
            reject("User id not found")
        }
        resolve(data["Order"])
    })
}


function getOrder(orderId){
    return new Promise((resolve, reject) => {
        if(orderId === undefined){
            reject("Order id not found");
        }
        resolve(data["ProductId"]);
    })
}

function getProduct(productId){
    return new Promise((resolve, reject) => {
        if(productId === undefined){
            reject("Product id not found")
        }
        resolve(data["ProductId"]);
    })
}

function getReviews(productId){
    return new Promise((resolve, reject) => {
        if(productId === undefined){
            reject("Product id not found")
        }
        resolve(data["Reviews"])
    })
}


getUser(1)
.then((userId) => {
    setTimeout(() => {
        
        return getOrders(userId);
    }, 1000)
})
.then((order) => {
    setTimeout(() => {
        console.log("User : ", data["User"])
        return getOrder(order);
    })
})
.then((productId) => {
    
})

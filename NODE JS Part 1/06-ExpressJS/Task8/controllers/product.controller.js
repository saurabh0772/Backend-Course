const products = [
    {
        "id" : 1,
        "name" : "phone"
    },
    {
        "id" : 2,
        "name" : "laptop"
    }
]

export function getProducts(req, res) {
    if(products.length === 0){
        return res.status(404).json({
            "msg" : "No products"
        })
    }

    res.json({
        products
    })
}


export function getProductById(req, res){
    const id = parseInt(req.params.id)

    const product = products.find((data) => data.id === id);
    if(product === undefined){
        return res.status(404).json({
            "error" : "product not found"
        })
    }

    res.json({
        product
    })
}
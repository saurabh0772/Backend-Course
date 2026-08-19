export const auth = (req, res, next) => {
    const data = req.headers

    // console.log(typeof(data['x-api-key']))
    if(Number(data['x-api-key']) !== 12345){
        const error = new Error("Unauthorised")
        error.statusCode = 403
        return next(error)
    }
    
    next()
   
}
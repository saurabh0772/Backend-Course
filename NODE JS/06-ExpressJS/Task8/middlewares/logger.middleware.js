export function logger(req, res, next){
    const date = new Date().toLocaleDateString()
    console.log(req.method , " ", req.url, date)

    next()
}
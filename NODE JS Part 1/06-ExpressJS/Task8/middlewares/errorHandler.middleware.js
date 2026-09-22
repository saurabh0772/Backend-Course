export const errorHandler = (err, req, res, next) => {
    if(err){
        return res.status(err.statusCode || 500).json({
            "msg" : err.message || "Internal Server Error"
        })
    }

    next();
}
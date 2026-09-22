export const auth = (req, res, next) => {
    const apiKeyId = req.headers['x-api-key']

    if(apiKeyId !== "12345"){
        const error = new Error("Not Authenticated")
        error.statusCode = 401;
        next(error)
    }

    next();
}
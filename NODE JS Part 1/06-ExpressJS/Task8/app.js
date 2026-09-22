import express from 'express'
import userRouter from './routes/user.routes.js'
import productRouter from './routes/product.routes.js'
import { logger } from './middlewares/logger.middleware.js'

const app = express()

app.use(express.json())

app.use(logger)


app.use('/api/users', userRouter)
app.use('/api/products', productRouter)


app.listen(3000, () => {
    console.log("Server is running at port 3000")
})
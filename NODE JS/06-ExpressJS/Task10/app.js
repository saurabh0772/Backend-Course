import express from 'express'
import jobRouter from './routes/job.routes.js'
import { errorHandler } from './middlewares/errorHandler.middleware.js'
import { auth } from './middlewares/auth.middleware.js'
import { logger } from './middlewares/logger.middleware.js'

const app = express()

app.use(express.json())
app.use(auth)
app.use(logger)


app.use('/api/jobs', jobRouter)

app.use((req, res) => {
    res.status(404).json({
        msg : "Route not found"
    })
})

app.use(errorHandler)

app.listen(3000, () => {
    console.log("Server is running at port 3000")
})
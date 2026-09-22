import express from 'express'
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js'
import { connectDB } from './db/db.js';
import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser())


connectDB();


app.use('/api/auth/', authRouter);

app.listen(3000, () => {
    console.log("Server is running at Port 3000");
})

export default app;
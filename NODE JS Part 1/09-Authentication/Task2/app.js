import express from 'express'
import { connectDB } from './database/db.js';
import {authRouter} from './routers/auth.router.js'

const app = express();

app.use(express.json());

connectDB();

app.use('/api/auth', authRouter);

app.listen(3000, () => {
    console.log("Server is running at port 3000")
})
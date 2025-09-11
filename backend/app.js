import express from 'express'
import { productRouter } from './routes/productRoutes.js';
import { configDotenv } from 'dotenv';
import { userRouter } from './routes/userRoute.js';
import cookieParser from 'cookie-parser'
import { orderRoute } from './routes/orderRoute.js';
import cors from 'cors'
configDotenv()
const app = express();

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST" , "PUT", "DELETE"],
  credentials: true,
}))
//route
app.use('/api/v1', productRouter)
app.use('/api/v1',userRouter)
app.use('/api/v1',orderRoute )


export default app;
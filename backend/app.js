import express from 'express'
import { productRouter } from './routes/productRoutes.js';
import { configDotenv } from 'dotenv';
import { userRouter } from './routes/userRoute.js';
import cookieParser from 'cookie-parser'
import { orderRoute } from './routes/orderRoute.js';
import { cartRouter } from './routes/cartRoute.js';
import { paymentRouter } from './routes/paymentRoute.js';
import { adminRouter } from './routes/adminRoutes.js';
import { authRouter } from './routes/authRoute.js';
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { sanitizeInput } from './middleware/validation.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
configDotenv()
const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  exposedHeaders: ["Set-Cookie"]
}));

app.options("*", cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));

app.use(rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests" },
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser())

app.use(sanitizeInput);


app.use('/api/v1', productRouter)
app.use('/api/v1', userRouter)
app.use('/api/v1', orderRoute);
app.use('/api/v1', cartRouter);
app.use('/api/v1', paymentRouter);
app.use('/api/v1', adminRouter);
app.use('/api/v1', authRouter);


app.get('/api/v1/test', (req, res) => {
  res.json({ success: true, message: "Server is working!" });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


app.use(errorMiddleware);

export default app;
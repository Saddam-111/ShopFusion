import express from 'express'
import { productRouter } from './routes/productRoutes.js';
import { configDotenv } from 'dotenv';
import { userRouter } from './routes/userRoute.js';
import cookieParser from 'cookie-parser'
import { orderRoute } from './routes/orderRoute.js';
import { cartRouter } from './routes/cartRoute.js';
import { paymentRouter } from './routes/paymentRoute.js';
import { adminRouter } from './routes/adminRoutes.js';
import cors from 'cors'
import { securityHeaders, generalLimiter, authLimiter } from './middleware/security.js';
import { sanitizeInput } from './middleware/validation.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
configDotenv()
const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Security headers
app.use(securityHeaders);

// Rate limiting
app.use(generalLimiter);

// Body parsing with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser())

// CORS - only allow frontend origin
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Input sanitization
app.use(sanitizeInput);

// Routes
app.use('/api/v1', productRouter)
app.use('/api/v1',userRouter)
app.use('/api/v1',orderRoute );
app.use('/api/v1', cartRouter);
app.use('/api/v1', paymentRouter);
app.use('/api/v1', adminRouter);

// Test route to verify server is working
app.get('/api/v1/test', (req, res) => {
  res.json({ success: true, message: "Server is working!" });
});

// 404 catch-all for unmatched routes (must be AFTER all routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handling (must be AFTER 404 handler)
app.use(errorMiddleware);

export default app;
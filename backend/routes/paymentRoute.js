import express from 'express';
import { verifyUserAuth } from '../middleware/userAuth.js';
import { createRazorpayOrder, verifyPayment, createCODOrder } from '../controllers/paymentController.js';
import { paymentLimiter } from '../middleware/security.js';

export const paymentRouter = express.Router();

paymentRouter.post('/payment/create-order', paymentLimiter, verifyUserAuth, createRazorpayOrder);
paymentRouter.post('/payment/verify', paymentLimiter, verifyUserAuth, verifyPayment);
paymentRouter.post('/payment/cod', paymentLimiter, verifyUserAuth, createCODOrder);
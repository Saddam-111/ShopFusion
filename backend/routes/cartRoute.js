import express from 'express';
import { verifyUserAuth } from '../middleware/userAuth.js';
import { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart } from '../controllers/cartController.js';

export const cartRouter = express.Router();

cartRouter.get('/cart', verifyUserAuth, getCart);
cartRouter.post('/cart/add', verifyUserAuth, addToCart);
cartRouter.put('/cart/update', verifyUserAuth, updateCartQuantity);
cartRouter.delete('/cart/remove', verifyUserAuth, removeFromCart);
cartRouter.delete('/cart/clear', verifyUserAuth, clearCart);
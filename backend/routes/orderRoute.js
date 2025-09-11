import express from 'express'
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js'
import { allMyOrder, createNewOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus } from '../controllers/orderController.js'
export const orderRoute = express.Router()

orderRoute.post('/new/order',verifyUserAuth, createNewOrder )
orderRoute.get('/admin/order/:id', verifyUserAuth, roleBasedAccess("admin", getSingleOrder))
orderRoute.get('/orders/user', verifyUserAuth, allMyOrder)

orderRoute.get('/orders/user', verifyUserAuth,roleBasedAccess("admin"), getAllOrders)


orderRoute.put('/admin/order/:id', verifyUserAuth, roleBasedAccess("admin", updateOrderStatus))

orderRoute.delete('/admin/order/:id', verifyUserAuth, roleBasedAccess("admin"), deleteOrder)
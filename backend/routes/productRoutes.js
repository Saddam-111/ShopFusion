import express from 'express'
import { createProducts, createReviewForProduct, deleteProduct, deleteReview, getAdminProducts, getAllProducts, getProductReviews, getSingleProduct, updateProduct } from '../controllers/productController.js';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';
import { upload } from '../middleware/multer.js';
export const productRouter = express.Router()


productRouter.post('/admin/product/create',verifyUserAuth,roleBasedAccess("admin"),upload.array("images",5), createProducts);


productRouter.get('/products', getAllProducts);
productRouter.get('/admin/products',verifyUserAuth, roleBasedAccess('admin'), getAdminProducts);


productRouter.put('/admin/product/:id',verifyUserAuth,roleBasedAccess("admin"), updateProduct)
productRouter.delete('/admin/product/:id',verifyUserAuth,roleBasedAccess("admin"), deleteProduct)
productRouter.get('/product/:id', getSingleProduct)


productRouter.put('/review',verifyUserAuth, createReviewForProduct)
productRouter.get('/reviews', getProductReviews)
productRouter.delete('/reviews', verifyUserAuth, deleteReview)
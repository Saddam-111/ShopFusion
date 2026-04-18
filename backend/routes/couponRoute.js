import express from 'express';
import { verifyUserAuth, roleBasedAccess } from '../middleware/userAuth.js';
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  removeCoupon,
  validateCoupon
} from '../controllers/couponController.js';

export const couponRouter = express.Router();

couponRouter.post('/coupons/validate', verifyUserAuth, validateCoupon);

couponRouter.post('/coupons/apply', verifyUserAuth, applyCoupon);

couponRouter.delete('/coupons/remove', verifyUserAuth, removeCoupon);

couponRouter.get('/coupons', verifyUserAuth, roleBasedAccess('admin'), getAllCoupons);

couponRouter.get('/coupons/:id', verifyUserAuth, roleBasedAccess('admin'), getCouponById);

couponRouter.post('/admin/coupons', verifyUserAuth, roleBasedAccess('admin'), createCoupon);

couponRouter.put('/admin/coupons/:id', verifyUserAuth, roleBasedAccess('admin'), updateCoupon);

couponRouter.delete('/admin/coupons/:id', verifyUserAuth, roleBasedAccess('admin'), deleteCoupon);
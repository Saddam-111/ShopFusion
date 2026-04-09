import express from 'express';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';
import { 
  getDashboardStats, 
  getRevenueChart, 
  getTopProducts, 
  getOrdersByStatus,
  getRecentOrders,
  getLowStockProducts,
  getUserGrowth,
  getCategoryStats,
  getMostViewedProducts
} from '../controllers/analyticsController.js';
import { generateDescription, chatWithAI, getRecommendations } from '../controllers/aiController.js';
import {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  deleteUser
} from '../controllers/userManagementController.js';

export const adminRouter = express.Router();

adminRouter.get('/admin/dashboard/stats', verifyUserAuth, roleBasedAccess('admin'), getDashboardStats);
adminRouter.get('/admin/dashboard/revenue', verifyUserAuth, roleBasedAccess('admin'), getRevenueChart);
adminRouter.get('/admin/dashboard/top-products', verifyUserAuth, roleBasedAccess('admin'), getTopProducts);
adminRouter.get('/admin/dashboard/orders-by-status', verifyUserAuth, roleBasedAccess('admin'), getOrdersByStatus);
adminRouter.get('/admin/dashboard/recent-orders', verifyUserAuth, roleBasedAccess('admin'), getRecentOrders);
adminRouter.get('/admin/dashboard/low-stock', verifyUserAuth, roleBasedAccess('admin'), getLowStockProducts);
adminRouter.get('/admin/dashboard/user-growth', verifyUserAuth, roleBasedAccess('admin'), getUserGrowth);
adminRouter.get('/admin/dashboard/category-stats', verifyUserAuth, roleBasedAccess('admin'), getCategoryStats);
adminRouter.get('/admin/dashboard/most-viewed', verifyUserAuth, roleBasedAccess('admin'), getMostViewedProducts);

adminRouter.get('/admin/users', verifyUserAuth, roleBasedAccess('admin'), getAllUsers);
adminRouter.get('/admin/user/:id', verifyUserAuth, roleBasedAccess('admin'), getUserById);
adminRouter.put('/admin/user/:id/block', verifyUserAuth, roleBasedAccess('admin'), blockUser);
adminRouter.put('/admin/user/:id/unblock', verifyUserAuth, roleBasedAccess('admin'), unblockUser);
adminRouter.delete('/admin/user/:id', verifyUserAuth, roleBasedAccess('admin'), deleteUser);

adminRouter.post('/ai/generate-description', verifyUserAuth, roleBasedAccess('admin'), generateDescription);
adminRouter.post('/ai/chat', verifyUserAuth, chatWithAI);
adminRouter.get('/ai/recommendations', getRecommendations);
adminRouter.get('/ai/recommendations/:userId', getRecommendations);
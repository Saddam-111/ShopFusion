import { Order } from '../models/orderModel.js';
import { Product } from '../models/productModel.js';
import User from '../models/userModel.js';
import redisClient, { cacheMiddleware } from '../config/redis.js';

export const getDashboardStats = async (req, res) => {
  try {
    let cacheKey = 'dashboard:stats';
    let cached = null;
    
    try {
      cached = await redisClient.get(cacheKey);
    } catch (redisErr) {
      console.log('Redis get error (continuing without cache):', redisErr.message);
    }
    
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const thisMonth = new Date(today);
    thisMonth.setDate(1);

    const [
      totalRevenue,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      totalOrders,
      todayOrders,
      totalProducts,
      totalUsers,
      pendingOrders,
      deliveredOrders
    ] = await Promise.all([
      Order.aggregate([
        { $match: { $or: [{ 'paymentInfo.status': 'PAID' }, { paymentMethod: 'COD' }] } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, $or: [{ 'paymentInfo.status': 'PAID' }, { paymentMethod: 'COD' }] } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: thisWeek }, $or: [{ 'paymentInfo.status': 'PAID' }, { paymentMethod: 'COD' }] } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: thisMonth }, $or: [{ 'paymentInfo.status': 'PAID' }, { paymentMethod: 'COD' }] } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments({ orderStatus: 'Processing' }),
      Order.countDocuments({ orderStatus: 'Delivered' })
    ]);

    const stats = {
      totalRevenue: totalRevenue[0]?.total || 0,
      todayRevenue: todayRevenue[0]?.total || 0,
      weekRevenue: weekRevenue[0]?.total || 0,
      monthRevenue: monthRevenue[0]?.total || 0,
      totalOrders,
      todayOrders,
      totalProducts,
      totalUsers,
      pendingOrders,
      deliveredOrders
    };

    try {
      await redisClient.setex(cacheKey, 300, JSON.stringify(stats));
    } catch (redisErr) {
      console.log('Redis set error (continuing without cache):', redisErr.message);
    }

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getRevenueChart = async (req, res) => {
  try {
    const { period = 'weekly' } = req.query;
    let startDate = new Date();
    
    switch (period) {
      case 'daily':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - 12);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          $or: [{ 'paymentInfo.status': 'PAID' }, { paymentMethod: 'COD' }]
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: period === 'monthly' ? '%Y-%m' : '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      revenueData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      { $group: { _id: '$orderItems.product', totalSold: { $sum: '$orderItems.quantity' }, revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          image: { $arrayElemAt: ['$product.images.url', 0] },
          totalSold: 1,
          revenue: 1,
          price: '$product.price'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      topProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getOrdersByStatus = async (req, res) => {
  try {
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      ordersByStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      orders: recentOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;
    
    const lowStockProducts = await Product.find({ stock: { $lte: threshold } })
      .select('name stock category')
      .sort({ stock: 1 })
      .limit(20);

    res.status(200).json({
      success: true,
      products: lowStockProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserGrowth = async (req, res) => {
  try {
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      userGrowth
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCategoryStats = async (req, res) => {
  try {
    const categoryStats = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.status(200).json({
      success: true,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMostViewedProducts = async (req, res) => {
  try {
    const mostViewed = await Product.find({ viewCount: { $gt: 0 } })
      .select('name category viewCount price images')
      .sort({ viewCount: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      products: mostViewed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
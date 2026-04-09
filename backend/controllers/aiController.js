import { generateProductDescription, generateChatResponse, getProductRecommendations } from '../services/aiService.js';
import { Product } from '../models/productModel.js';
import User from '../models/userModel.js';
import { Order } from '../models/orderModel.js';

export const generateDescription = async (req, res) => {
  try {
    const { title, category } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title and category are required'
      });
    }

    const description = await generateProductDescription(title, category);
    
    res.status(200).json({
      success: true,
      description
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const chatWithAI = async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    let context = '';
    
    if (userId) {
      const user = await User.findById(userId).select('name role');
      const orders = await Order.find({ user: userId }).populate('orderItems.product', 'name category price');
      
      context = `User: ${user?.name || 'Guest'}. `;
      
      if (orders.length > 0) {
        const purchasedProducts = orders.flatMap(o => o.orderItems.map(i => i.name)).join(', ');
        context += `Previous purchases: ${purchasedProducts}. `;
      }
      
      const userProducts = await User.findById(userId).select('viewHistory');
      if (userProducts?.viewHistory?.length > 0) {
        context += `Recently viewed: ${userProducts.viewHistory.slice(-5).join(', ')}.`;
      }
    }

    const products = await Product.find({ stock: { $gt: 0 } }).select('name category price description').limit(10);
    context += `\n\nAvailable products:\n${products.map(p => `${p.name} - ${p.category} - $${p.price}`).join('\n')}`;

    const response = await generateChatResponse(message, context);
    
    res.status(200).json({
      success: true,
      response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let userHistory = [];
    let recommendedProducts = [];
    
    if (userId) {
      const user = await User.findById(userId).select('viewHistory');
      userHistory = user?.viewHistory || [];
      
      if (userHistory.length > 0) {
        const categories = [...new Set(userHistory.map(h => h.split(' - ')[1]))];
        const lastViewed = userHistory.slice(-3);
        
        recommendedProducts = await Product.find({
          $or: [
            { category: { $in: categories } },
            { name: { $in: lastViewed.map(h => h.split(' - ')[0]) } }
          ],
          stock: { $gt: 0 }
        }).sort({ rating: -1 }).limit(10);
      }
    }
    
    if (recommendedProducts.length === 0) {
      recommendedProducts = await Product.find({ stock: { $gt: 0 } })
        .sort({ rating: -1, numOfReviews: -1 })
        .limit(10);
    }
    
    res.status(200).json({
      success: true,
      products: recommendedProducts,
      basedOn: userHistory.length > 0 ? 'user_history' : 'popular'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
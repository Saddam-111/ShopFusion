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
      const orders = await Order.find({ user: userId }).select('orderItems');
      
      context = `User: ${user?.name || 'Guest'}. `;
      
      if (orders.length > 0) {
        const purchasedProducts = orders.flatMap(o => o.orderItems.map(i => i.name)).join(', ');
        context += `Previous purchases: ${purchasedProducts}. `;
      }
    }

    const products = await Product.find({ stock: { $gt: 0 } }).select('name category price description _id').limit(10);
    console.log('Products for AI context:', products.map(p => ({ id: p._id, name: p.name })));
    context += `\n\nProducts: ${products.map(p => `${p.name} ($${p.price})`).join(', ')}`;
    context += `\n\nWhen you recommend products, use this format for clickable links: [PRODUCT:product_id|Product Name]`;

    console.log('Sending to AI with context:', context);
    const response = await generateChatResponse(message, context);
    
    res.status(200).json({
      success: true,
      response
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let recommendedProducts = [];
    let hasOrderHistory = false;
    
    if (userId) {
      const orders = await Order.find({ user: userId }).select('orderItems');
      hasOrderHistory = orders.length > 0;
      
      if (orders.length > 0) {
        recommendedProducts = await Product.find({ stock: { $gt: 0 } })
          .sort({ rating: -1, numOfReviews: -1 })
          .limit(10);
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
      basedOn: hasOrderHistory ? 'user_history' : 'popular'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
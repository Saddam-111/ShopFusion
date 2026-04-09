

import User from "../models/userModel.js";
import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";
import { generateInvoice } from "../utils/invoiceGenerator.js";
import { emitToUser } from "../config/socket.js";


//create New Order
export const createNewOrder = async (req , res) => {
  try {
    const {shippingInfo, orderItems, paymentInfo,itemPrice, taxPrice, shippingPrice, totalPrice} = req.body

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id
    })
    
    const user = await User.findById(req.user._id).select('name email');
    const pdfBuffer = await generateInvoice(order, user);
    
    res.status(200).json({
      success: true,
      order,
      invoice: pdfBuffer.toString('base64')
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//Getting single order
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name, email");
    if(!order){
      return res.status(404).json({
        success: false,
        message: "No order found"
      })
    }
    res.status(200).json({
      success: true, 
      order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



//All my order
export const allMyOrder = async (req, res) => {
  try {
    const orders = await Order.find({user:req.user._id})
    if(!orders || orders.length === 0){
      return res.status(404).json({
        success: false,
        message: "No order found"
      })
    }
    res.status(200).json({ 
      success: true, 
      orders
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


//Getting all orders 
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 15, status, search } = req.query;
    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);

    const totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.status(200).json({
      success: true,
      orders,
      total,
      totalAmount,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    })
  } catch (error) {
     res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


//Update order status

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order found"
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "This order has already been delivered."
      });
    }

    const oldStatus = order.orderStatus;

    // ✅ Fix: correct key is item.product (not item.Product)
    await Promise.all(order.orderItems.map(item =>
      updateQuantity(item.product, item.quantity)
    ));

    order.orderStatus = req.body.status;

    if (order.orderStatus === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    const { emitOrderUpdate } = await import('../config/socket.js');
    emitOrderUpdate(order, oldStatus);

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

async function updateQuantity(id, quantity) {
  const product = await Product.findById(id); // ✅ await added

  if (!product) {
    throw new Error("Product not found"); // ✅ No res here
  }

  product.stock -= quantity;
  await product.save({ validateBeforeSave: false }); // ✅ consistent save
}




//Delete order
export const deleteOrder = async (req , res) => {
  try {
    const order = await Order.findById(req.params.id);
    if(!order){
      return res.status(404).json({
        success: false,
        message: "No order found"
      })
    }
    if(order.orderStatus !== "Delivered"){
      return res.status(404).json({
        success: false,
        message: "This order is under Processing. This cann't be deleted."
      })
    }
    await order.deleteOne({_id:req.params.id})

    res.status(200).json({
      success: true, 
      message: "Order deleted successfully."
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const pdfBuffer = await generateInvoice(order, order.user);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
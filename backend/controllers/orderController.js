

import User from "../models/userModel.js";
import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";



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
    res.status(200).json({
      success: true,
      order,
    })
  } catch (error) {
    console.log(error)
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
    const orders = await Order.findById({user:req.user._id})
    if(!orders){
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
    const orders = Order.find()
    let totalAmount = 0;
    orders.forEach(order => {
      totalAmount += order.totalPrice
    })
    res.status(200).json({
      success: true,
      orders,
      totalAmount
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

    // ✅ Fix: correct key is item.product (not item.Product)
    await Promise.all(order.orderItems.map(item =>
      updateQuantity(item.product, item.quantity)
    ));

    order.orderStatus = req.body.status;

    if (order.orderStatus === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

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
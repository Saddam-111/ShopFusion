import { uploadCloudinary } from "../config/cloudinary.js";
import { Product } from "../models/productModel.js"
import ApiFunctionality from "../utils/ApiFunctionality.js"

// Create Product
export const createProducts = async (req, res) => {
  try {
    req.body.user = req.user.id;
    let images = [];
    //handle multiple product images 
    if(req.files && req.files.length > 0){
      for(const file of req.files){
        const uploadCloudinaryImage = await uploadCloudinary(file.path, "products");
        images.push({
          publicId: uploadCloudinaryImage.public_id,
          url: uploadCloudinaryImage.secure_url
        })
      }
    }
    req.body.images = images;
    const newProduct = await Product.create(req.body)
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 6;
    const apiFeatures = new ApiFunctionality(Product.find(), req.query).search().filter()


    //console.log(apiFunctionality)
    //getting filtered query befire pagination
    const filteredQuery = apiFeatures.query.clone()
    const productCount = await filteredQuery.countDocuments();

    //calculate totalpages based on filtered count
    const totalPages = Math.ceil(productCount/resultPerPage);
    const page = Number(req.query.page) || 1;

    if(page>totalPages && productCount >0){
      res.status(404).json({
        success: false,
        message: "This page doesn't exist"
      })
    }

    //apply pagination
    apiFeatures.pagination(resultPerPage);

    const products = await apiFeatures.query
    if(!products || products.length ===0)
      return res.status(404).json({
    success: false,
    message: "No Product Found"
  })
    res.status(200).json({
      success: true,
      products, 
      productCount,
      resultPerPage, 
      totalPages,
      currentpage: page
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Get Single Product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }
    res.status(200).json({
      success: true,
      product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    await Product.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Creating and Updating reviews
export const createReviewForProduct = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviewExists = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (reviewExists) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = Number(rating);
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
    }

    // Update numOfReviews and average rating
    product.numOfReviews = product.reviews.length;
    product.rating = product.reviews.length
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      : 0;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//Getting reviews 
export const getProductReviews = async (req , res) => {
  try {
    const product = await Product.findById(req.query.id);
    if(!product){
      return res.status(400).json({
        success: false,
        message: "Product not found"
      })
    }
    res.json({
      success: true,
      reviews:product.reviews
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//Delete reviews
export const deleteReview = async (req , res) => {
  try {
    const product = await Product.findById(req.query.productId)
    if(!product){
      return res.status(400).json({
        success: false,
        message: "Product not found"
      })
    }
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())
    let sum = 0;
    reviews.forEach(review => {
      sum = sum + review.rating
    })
    const ratings = reviews.length ? sum / reviews.length : 0
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId, 
      {
        reviews, 
        ratings, 
        numOfReviews
      }, {
        new: true, 
        runValidators: true
      })
      res.status(200).json({
        success: true, 
        message: "Review deleted successfully"
      })
      
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}




//Admin = getting all product
export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.stats(200).json({
      success: true, 
      products
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
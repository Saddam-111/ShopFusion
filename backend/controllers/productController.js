import { uploadCloudinary } from "../config/cloudinary.js";
import { Product } from "../models/productModel.js"
import ApiFunctionality from "../utils/ApiFunctionality.js"

export const createProducts = async (req, res) => {
  try {
    req.body.user = req.user.id;
    let images = [];
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

export const getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 6;
    const apiFeatures = new ApiFunctionality(Product.find(), req.query).search().filter()

    const filteredQuery = apiFeatures.query.clone()
    const productCount = await filteredQuery.countDocuments();

    const totalPages = Math.ceil(productCount/resultPerPage);
    const page = Number(req.query.page) || 1;

    if(page>totalPages && productCount >0){
      return res.status(404).json({
        success: false,
        message: "This page doesn't exist"
      })
    }

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

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }
    
    product.viewCount += 1;
    await product.save({ validateBeforeSave: false });
    
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

export const deleteReview = async (req , res) => {
  try {
    const product = await Product.findById(req.query.productId)
    if(!product){
      return res.status(400).json({
        success: false,
        message: "Product not found"
      })
    }
    const review = product.reviews.find(review => review._id.toString() === req.query.id.toString())
    if(!review){
      return res.status(404).json({
        success: false,
        message: "Review not found"
      })
    }
    if(review.user.toString() !== req.user._id.toString()){
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
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
        rating: ratings, 
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




export const getAdminProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, stock, minPrice, maxPrice, sort } = req.query;
    const resultPerPage = parseInt(limit);
    const skip = (parseInt(page) - 1) * resultPerPage;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (stock === 'out') {
      query.stock = 0;
    } else if (stock === 'low') {
      query.stock = { $gt: 0, $lte: 10 };
    } else if (stock === 'available') {
      query.stock = { $gt: 10 };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'name_asc') sortOption = { name: 1 };
    else if (sort === 'name_desc') sortOption = { name: -1 };
    else if (sort === 'stock_asc') sortOption = { stock: 1 };
    else if (sort === 'stock_desc') sortOption = { stock: -1 };

    const [products, productCount] = await Promise.all([
      Product.find(query).skip(skip).limit(resultPerPage).sort(sortOption),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(productCount / resultPerPage);

    res.status(200).json({
      success: true,
      products,
      productCount,
      resultPerPage,
      totalPages,
      currentPage: parseInt(page)
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
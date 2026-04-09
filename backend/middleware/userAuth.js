import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';

export const verifyUserAuth = async (req , res, next) => {
  try {
    const {token} = req.cookies;

    if(!token){
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedData || !decodedData.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    req.user = await User.findById(decodedData.id);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    if (req.user.blocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked"
      });
    }
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }
    return res.status(500).json({
      success: false, 
      message: "Internal server error"
    });
  }
}


export const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    next();
  };
};

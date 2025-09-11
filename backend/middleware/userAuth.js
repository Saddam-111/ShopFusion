import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';


export const verifyUserAuth = async (req , res, next) => {
  try {
    const {token} = req.cookies;
    //console.log(token)

    if(!token){
      res.status(401).json({
        success: false,
        message: "Authentication is missing"
      })
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET_KEY);
    //console.log(decodedData)
    req.user = await User.findById(decodedData.id);
    next()
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: error.message
    })
  }
}


export const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not authorized to perform this action.",
      });
    }
    next();
  };
};

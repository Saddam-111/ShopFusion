import express from 'express';
import { verifyRefreshToken, revokeRefreshToken, generateRefreshToken } from '../utils/refreshTokenUtils.js';
import User from '../models/userModel.js';
import { sendToken } from '../utils/jwtToken.js';

export const authRouter = express.Router();

authRouter.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    const decoded = await verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token"
      });
    }

    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    await revokeRefreshToken(refreshToken);
    
    const newRefreshToken = await generateRefreshToken(user);
    
    const accessToken = user.getJWTToken();
    
    res.status(200).json({
      success: true,
      token: accessToken,
      refreshToken: newRefreshToken,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/refreshTokenModel.js';

const getRefreshSecret = () => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is required for production. Add it to your environment variables.');
  }
  return process.env.JWT_REFRESH_SECRET;
};

export const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { id: user._id },
    getRefreshSecret(),
    { expiresIn: '7d' }
  );

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return refreshToken;
};

export const verifyRefreshToken = async (token) => {
  try {
    const refreshTokenDoc = await RefreshToken.findOne({ token });
    
    if (!refreshTokenDoc) {
      return null;
    }

    const decoded = jwt.verify(token, getRefreshSecret());

    return decoded;
  } catch (error) {
    return null;
  }
};

export const revokeRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};

export const revokeAllUserTokens = async (userId) => {
  await RefreshToken.deleteMany({ user: userId });
};
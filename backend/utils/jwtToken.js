export const sendToken = (user, res, statusCode = 200) => {
  const token = user.getJWTToken();

  const isProduction = process.env.NODE_ENV === "production";
  
  const options = {
    expires: new Date(Date.now() + process.env.EXPIRE_COOKIE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    credentials: true,
  };

  res.status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user,
      token,
    });
};



import { deleteCloudinary, uploadCloudinary } from "../config/cloudinary.js";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto'
// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    let avatar = null;
    if(req.file){
      const uploadResult =await uploadCloudinary(req.file.path, "users_profile_avatars");
      avatar = {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url
      }
    }

    const user = await User.create({
     name,
     email,
     password,
     avatar
    });
    sendToken(user, res, 201);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or password is missing",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password is invalid",
      });
    }

    sendToken(user, res, 200);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// LOGOUT
export const logoutUser = async (req, res) => {
  try {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed. " + error.message,
    });
  }
};




//FORGOT PASSWORD
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist"
      })
    }
    let resetToken;
    resetToken = user.generatePasswordResetToken()
    //console.log(resetToken)
    await user.save({ validateBeforeSave: false })

    const resetPasswordURL = `${process.env.BASE_URL || 'http://localhost:5000'}/api/v1/reset/${resetToken}`;
    const message = `Use the following link to reset your password: ${resetPasswordURL}. \n\n This link will expire in 15 minutes. \n\n If you didn't request a password reset. please ignore this message.`
    try {
      //send Email
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message
      })
      res.status(200).json({
        success: true,
        message: `Email is send to ${user.email}`
      })

    } catch (error) {
      user.resetPasswordExpire = undefined;
      user.resetPasswordToken = undefined;
      await user.save({ validateBeforeSave: false })
      return res.status(500).json({
        success: false,
        message: "Email could not be sent"
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'could not save reset token try again later'
    })
  }


}


//RESET PASSWORD

export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user){
      return res.status(400).json({
        success: false,
        message: "Reset password token is invalid or has been expired"
      })
    }

    const {password, confirmPassword} = req.body
    if(!password || !confirmPassword){
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials"
      })
    }
    if(password !== confirmPassword){
      return res.status(401).json({
        success: false,
        message: "Password & Confirm Password are not same."
      })
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save()
    sendToken(user, res, 200)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}




//GET USER DETAILS
export const getUserDetails = async(req , res) => {
  try {
    const user = await User.findById(req.user.id)
   // console.log(user);
   res.status(200).json({
    success: true,
    user,
   })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


//UPDATE PASSWORD 
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Incomplete fields",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password and Confirm Password do not match.",
      });
    }

    const user = await User.findById(req.user.id).select("+password");
    const passwordMatch = await user.verifyPassword(oldPassword);

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save(); // ✅ Hashes and saves the new password

    sendToken(user, res, 200); // ✅ Then send updated token
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//UPDATING USER PROFILE
export const updateProfile = async(req , res) => {
  try {
    const {name, email} = req.body;
    const updatedUserDetails = {name, email};
  
    const user = await User.findByIdAndUpdate(req.user.id, updatedUserDetails, {new: true, runValidators: true})
    res.status(200).json({
      success: true, 
      message: "Profile Updated Successfully",
      user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



//Admin = getting user information
export const getUserList = async (req, res) => {
  try {
    const resultPerPage = 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * resultPerPage;

    const users = await User.find().skip(skip).limit(resultPerPage);
    const userCount = await User.countDocuments();
    const totalPages = Math.ceil(userCount / resultPerPage);

    res.status(200).json({
      success: true,
      users,
      userCount,
      resultPerPage,
      totalPages,
      currentPage: page
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


//Admin- getting single user information
export const getSingleUser = async (req , res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user){
      return res.status(404).json({
        success: false,
        message: `User not found with this id: ${req.params.id}`
      })
    }
    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: error.message
    })
  }
}


//Admin changing user role
export const updateUserRole = async (req , res) => {
  try {
    const {role} = req.body;
    const newUserData = {
      role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {new: true, runValidators: true})
    if(!user){
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      })
    }
    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



//Admin deleting user Profile

export const deleteUserProfile = async (req , res) => {
  try {
    const user =await User.findById(req.params.id);
    if(!user){
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      })
    }
    if(user.avatar && user.avatar.publicId){
      await deleteCloudinary(user.avatar.publicId)
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true, 
      message: "User Deleted Successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
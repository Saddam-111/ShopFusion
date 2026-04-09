import mongoose from "mongoose";
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [25,"Invalid name. Please enter name less than 25 character"],
    minLength: [3, "Name should contain more than 3 character"]
  },

  email: {
    type: String,
    required: [true, "Please Enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minLength: [6, "Password must be at least 6 characters long"], 
    select: false,
  },
  avatar: {
    publicId: {
      type: String,
    },
    url: {
      type: String,
    }
  },
  role: {
    type: String,
    default: "user"
  },
  blocked: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire : Date,
}, {timestamps: true})

userSchema.index({ email: 1 });


//password hashing
userSchema.pre("save", async function(next){
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.getJWTToken = function(){
  return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRE})
}

userSchema.methods.verifyPassword =async function(userEnteredPassword){
  return await bcrypt.compare(userEnteredPassword, this.password)
}

//generating token
userSchema.methods.generatePasswordResetToken = function(){
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.resetPasswordExpire = Date.now() + 15*60*1000 //15 minutes
  return resetToken;
}

const User = mongoose.model("User", userSchema);
export default User;
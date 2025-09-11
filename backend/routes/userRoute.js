import express from 'express'
import { deleteUserProfile, getSingleUser, getUserDetails, getUserList, loginUser, logoutUser, registerUser, requestPasswordReset, resetPassword, updatePassword, updateProfile, updateUserRole } from '../controllers/userController.js'
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js'
import { upload } from '../middleware/multer.js'

export const userRouter = express.Router()


userRouter.post('/register', upload.single("avatar"), registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/logout', logoutUser)
userRouter.post('/password/forgot',requestPasswordReset)
userRouter.post('/reset/:token',resetPassword )
userRouter.get('/profile',verifyUserAuth, getUserDetails)

userRouter.post('/password/update', verifyUserAuth, updatePassword)

userRouter.post('/profile/update', verifyUserAuth, updateProfile)

userRouter.post('/admin/users', verifyUserAuth,roleBasedAccess('admin') , getUserList)

userRouter.post('/admin/user/:id', verifyUserAuth,roleBasedAccess('admin') , getSingleUser)

userRouter.put('/admin/user/:id', verifyUserAuth,roleBasedAccess('admin') , updateUserRole)

userRouter.delete('/admin/user/:id', verifyUserAuth,roleBasedAccess('admin') , deleteUserProfile)
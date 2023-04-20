import express from 'express'
import { Otp, eventForm, forgotPassword, resend, userData, userLogin, userResetPassword, userSignUp } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'
const router = express.Router()

router.post('/signUp',userSignUp)
router.post('/login',userLogin)
router.post('/otp',Otp)
router.post('/resend-otp',resend)
router.post('/forgot', forgotPassword)
router.post('/reset-pswrd', userResetPassword)
router.post('/add-event',userAuth,eventForm)
router.post('/user-data',userAuth,userData)

export default router
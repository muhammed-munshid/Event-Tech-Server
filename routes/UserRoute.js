import express from 'express'
import { Otp, forgotPassword, resend, userLogin, userResetPassword, userSignUp } from '../controllers/userController.js'
const router = express.Router()

router.post('/signUp',userSignUp)
router.post('/login',userLogin)
router.post('/otp',Otp)
router.post('/resend-otp',resend)
router.post('/forgot', forgotPassword)
router.post('/reset-pswrd', userResetPassword)

export default router
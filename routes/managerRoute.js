import express from 'express'
const router = express.Router()
import { forgetPassword, Login, resendOtp, resetPassword, signUp, signUpWithOtp } from '../controllers/managerController.js'

router.post('/', Login)
router.post('/signUp', signUp)
router.post('/otp', signUpWithOtp)
router.post('/resend-otp',resendOtp)
router.post('/forgot', forgetPassword)
router.post('/reset-pswrd', resetPassword)

export default router
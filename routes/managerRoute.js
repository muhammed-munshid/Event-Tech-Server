import express from 'express'
const router = express.Router()
import authMiddleware from '../middleware/authMiddleware.js'
import { forgetPassword, getUserId, Login, resendOtp, resetPassword, signUp, signUpWithOtp } from '../controllers/managerController.js'

router.post('/', Login)
router.post('/signUp', signUp)
router.post('/otp', signUpWithOtp)
router.post('/resend-otp',resendOtp)
router.post('/forgot', forgetPassword)
router.post('/reset-pswrd', resetPassword)
router.post('/get-user-info-by-id', authMiddleware, getUserId)

export default router
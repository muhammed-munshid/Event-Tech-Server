import express from 'express'
const router = express.Router()
import authMiddleware from '../middleware/authMiddleware.js'
import { forgetPassword, getUserId, Login, resetOtp, resetPassword, signUp, signUpWithOtp } from '../controllers/managerController.js'

router.post('/signUp', signUp)
router.post('/otp', signUpWithOtp)
router.post('/forgot', forgetPassword)
router.post('/reset-otp', resetOtp)
router.post('/reset-pswrd', resetPassword)
router.post('/', Login)
router.post('/get-user-info-by-id', authMiddleware, getUserId)


export default router
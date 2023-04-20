import express from 'express'
const router = express.Router()
import { addServices, bookingDetails, bookings, forgetPassword, Login, managerData, resendOtp, resetPassword, services, signUp, signUpWithOtp } from '../controllers/managerController.js'
import managerAuth from '../middleware/managerAuth.js'

router.post('/', Login)
router.post('/signUp', signUp)
router.post('/otp', signUpWithOtp)
router.post('/resend-otp',resendOtp)
router.post('/forgot', forgetPassword)
router.post('/reset-pswrd', resetPassword)
router.post('/manager-data',managerAuth,managerData)
router.post('/bookings/:id', bookingDetails)
router.post('/bookings',managerAuth, bookings)
router.post('/add-services',managerAuth, addServices)
router.post('/services',managerAuth, services)

export default router
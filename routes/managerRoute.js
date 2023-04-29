import express from 'express'
const router = express.Router()
import { addCatering, bookingDetails, bookings, forgetPassword, getDetails, Login, managerData, managerProfile, resendOtp, resetPassword, services, signUp, signUpWithOtp, viewServices } from '../controllers/managerController.js'
import managerAuth from '../middleware/managerAuth.js'

router.post('/', Login)
router.post('/signUp', signUp)
router.post('/otp', signUpWithOtp)
router.post('/resend-otp', resendOtp)
router.post('/forgot', forgetPassword)
router.post('/reset-pswrd', resetPassword)
router.post('/manager-data', managerAuth, managerData)
router.post('/bookings/:id', bookingDetails)
router.post('/bookings', managerAuth, bookings)
router.post('/view-services', managerAuth, viewServices)
router.post('/services', managerAuth, services)
router.post('/add-catering', managerAuth, addCatering)
router.post('/add-manager-profile', managerAuth, managerProfile)
router.post('/get-manager-details', managerAuth, getDetails)

export default router
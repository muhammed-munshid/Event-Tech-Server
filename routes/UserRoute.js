import express from 'express'
import { Otp, addProfile, companyDetails, companyList, eventForm, forgotPassword, loginGoogle, profileDetails, resend, serviceDetails, userData, userLogin, userResetPassword, userSignUp, viewMenuList } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'
const router = express.Router()

router.post('/signUp',userSignUp)
router.post('/login',userLogin)
router.post('/google-login/:id',loginGoogle)
router.post('/otp',Otp)
router.post('/resend-otp',resend)
router.post('/forgot', forgotPassword)
router.post('/reset-pswrd', userResetPassword)
router.post('/add-event',userAuth,eventForm)
router.post('/user-data',userAuth,userData)
router.post('/company-list',userAuth,companyList)
router.post('/company-list/:id',userAuth,companyDetails)
router.post('/service-details',userAuth,serviceDetails)
router.post('/view-menu-list/:id',userAuth,viewMenuList)
router.post('/add-profile',userAuth,addProfile)
router.post('/profile-details',userAuth,profileDetails)

export default router
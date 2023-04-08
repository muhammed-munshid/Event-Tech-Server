import express from 'express'
import { Otp, userLogin, userSignUp } from '../controllers/userController.js'
const router = express.Router()

router.post('/signUp',userSignUp)
router.post('/login',userLogin)
router.post('/otp',Otp)

export default router
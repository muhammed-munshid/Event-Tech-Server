import express from 'express';
import { adminLogin, blockManager, notification } from '../controllers/adminController.js';
const router = express.Router()

router.get('/notify', notification)

router.post('/', adminLogin)
router.post('/block', blockManager)

export default router
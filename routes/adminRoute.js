import express from 'express';
import { adminLogin, approvalManager, notification } from '../controllers/adminController.js';
const router = express.Router()

router.get('/notify', notification)

router.post('/', adminLogin)
router.post('/approval', approvalManager)

export default router
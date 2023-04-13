import express from 'express';
import { adminLogin, blockManager, blockUser, companies, companyDetails, managerDetails, managers, notification, users } from '../controllers/adminController.js';
const router = express.Router()

router.get('/notify', notification)
router.get('/users', users)
router.get('/managers', managers)

router.post('/', adminLogin)
router.post('/block-manager', blockManager)
router.post('/block-users', blockUser)
router.post('/managers/:id', managerDetails)

export default router
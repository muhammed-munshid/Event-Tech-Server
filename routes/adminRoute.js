import express from 'express';
import { adminLogin, approvalList, approvalManager, blockManager, blockUser, managerDetails, managers, salesReport, users } from '../controllers/adminController.js';
const router = express.Router()

router.get('/users', users)
router.get('/managers', managers)
router.get('/approval-list', approvalList)

router.post('/', adminLogin)
router.post('/block-manager', blockManager)
router.post('/approval', approvalManager)
router.post('/block-users', blockUser)
router.post('/managers/:id', managerDetails)
router.post('/sales-report',salesReport)

export default router
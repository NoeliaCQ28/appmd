import express from 'express'
import { editUser, login, logout, register, user } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)
router.get('/user', authMiddleware, user)
router.put('/user/:id', authMiddleware, editUser)

export default router
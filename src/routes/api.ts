import { Router } from 'express'
import { AuthController } from '../controllers/auth-controller'
import { rateLimiterMiddleware } from '../middleware/rate-limit-middleware'
import rateLimit from 'express-rate-limit'
import { authMiddleware } from '../middleware/auth-middleware'
import { AssetController } from '../controllers/asset-controller'
import { RoleEnum } from '../entities/role-entity'

const loginRateLimiter = rateLimit({
	windowMs: 1 * 20 * 1000,
	limit: 3,
	message: {
        statusCode: 429,
        error: 'Too many attempts',
        message: 'Too many attempts from this IP, please try again later'
    },
    skipSuccessfulRequests: true
})

const router = Router()

router.post('/auth/login', [loginRateLimiter, AuthController.login])
router.post('/auth/x-login', AuthController.login)
router.get('/auth', [authMiddleware(), AuthController.current])

router.get('/assets', AssetController.index)
router.get('/assets/:id', AssetController.show)
router.post('/assets', [authMiddleware(RoleEnum.Operator), AssetController.create])
router.post('/assets/:id/approve', [authMiddleware(), AssetController.aprove])
router.post('/assets/:id/reject', [authMiddleware(), AssetController.reject])

export default router

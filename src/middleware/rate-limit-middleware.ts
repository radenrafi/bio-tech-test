import { NextFunction, Request, Response } from 'express'
import rateLimit, { Options } from 'express-rate-limit'

export const rateLimiterMiddleware = (options: Options) => {
	const limiter = rateLimit(options)

	return (req: Request, res: Response, next: NextFunction) => {
		limiter(req, res, () => {
			// Jika rate limit terlampaui, modifikasi respons error
			if (res.statusCode === 429) {
				const retryAfter = res.getHeader('Retry-After') as string
				if (retryAfter) {
					const seconds = Math.ceil(parseFloat(retryAfter))
					res.status(429).json({
						statusCode: 429,
						message: `Too many attempts from this IP, please try again later in ${seconds}s.`,
						error: retryAfter,
					})
				} else {
					next()
				}
			} else {
				next()
			}
		})
	}
}

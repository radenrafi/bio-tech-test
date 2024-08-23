import { Response, Request, NextFunction } from 'express'
import { ZodError } from 'zod'
import { ResponseError } from '../error/response-error'
import { formatZodError } from '../helper/utils'

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
	if (error instanceof ZodError) {
		res.status(400).json({
			statusCode: 400,
			error: formatZodError(error),
			message: 'Validation error'
		})
	} else if (error instanceof ResponseError) {
		res.status(error.status).json({
			statusCode: error.status,
			error: error.message,
			message: error.name
		})
	} else {
		res.status(500).json({
			statusCode: 500,
			error: error.message,
			message: 'Internal server error'
		})
	}
}

import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express'
import { errorMiddleware } from '../middleware/error-middleware'
import publicRouter from '../routes/public'
import apiRouter from '../routes/api'
import { APP_ENV, APP_PORT } from './environment'

export const app = express()

app.set('port', APP_PORT)
app.set('env', APP_ENV)
app.use(express.json())
app.use('/', publicRouter)
app.use('/v1', apiRouter)
app.use(errorMiddleware)

app.use((req: Request, res: Response, next: NextFunction) => {
	res.status(404).json({
		statusCode: 404,
		message: 'Not Found',
		error: 'Routes does not exists'
	})
})

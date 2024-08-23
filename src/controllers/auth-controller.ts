import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/auth-service';
import { AuthRequest } from '../types/auth-request';

export class AuthController {
	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const response = await AuthService.login(req.body);
			res.status(200).json({
				statusCode: 200,
				data: response,
				message: 'Login success',
			});
		} catch (e) {
			next(e);
		}
	}

	static async current(req: AuthRequest, res: Response, next: NextFunction) {
		try {
			res.status(200).json({
				statusCode: 200,
				data: req.auth,
				message: 'User successfully obtained',
			});
		} catch (e) {
			next(e);
		}
	}
}

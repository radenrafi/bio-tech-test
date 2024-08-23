import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { APP_SECRET } from '../config/environment';
import { AuthRequest } from '../types/auth-request';
import { User } from '../entities/user-entity';
import { RoleEnum } from '../entities/role-entity';

type RoleAccess = RoleEnum;

export const authMiddleware = (role?: RoleAccess) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).send({
                statusCode: 401,
                error: 'Unauthorized',
                message: 'Token not found in header',
            });
        }
        try {
            const token = authorization.split(' ')[1];
            const decoded = jwt.verify(token, APP_SECRET) as any;
            const user = await User.findOne({
                where: { id: decoded.id },
                relations: ['role'],
            })
            if (!user) {
                return res.status(404).send({
                    statusCode: 404,
                    error: 'Unauthorized',
                    message: 'User not identified',
                });
            }
            if (role && user.role.name != role) {
                return res.status(403).send({
                    statusCode: 403,
                    error: 'Unauthorized',
                    message: 'User does not have access',
                });
            }
            req.auth = user
        } catch (error) {
            let message = 'Token is invalid'
            if (error instanceof jwt.TokenExpiredError) {
                message = 'Token is expired'
            }
            return res.status(401).send({
                statusCode: 401,
                error: 'Unauthorized',
                message,
            });
        }
        next();
    };
};

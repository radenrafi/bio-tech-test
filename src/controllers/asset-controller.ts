import { NextFunction, Request, Response } from "express"
import AssetService from "../services/asset-service"
import { AuthRequest } from "../types/auth-request"

export class AssetController {
    static async index(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await AssetService.index()
            res.status(200).json({
                statusCode: 200,
                data: response,
                message: "Assets successfully obtained"
            })
        } catch (e) {
            next(e)
        }
    }

    static async show(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await AssetService.show(req.params.id)
            res.status(200).json({
                statusCode: 200,
                data: response,
                message: "Asset successfully obtained"
            })
        } catch (e) {
            next(e)
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await AssetService.create(req.body.name)
            res.status(200).json({
                statusCode: 200,
                data: response,
                message: "Asset successfully created"
            })
        } catch (e) {
            next(e)
        }
    }

    static async aprove(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const response = await AssetService.approve(req.params.id, req.auth.role.name)
            res.status(200).json({
                statusCode: 200,
                data: response,
                message: "Asset successfully approved"
            })
        } catch (e) {
            next(e)
        }
    }

    static async reject(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const response = await AssetService.reject(req.params.id, req.auth.role.name)
            res.status(200).json({
                statusCode: 200,
                data: response,
                message: "Asset successfully rejected"
            })
        } catch (e) {
            next(e)
        }
    }
}
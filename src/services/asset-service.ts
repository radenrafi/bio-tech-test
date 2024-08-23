import { Asset } from "../entities/asset-entity"
import { RoleEnum } from "../entities/role-entity"
import { ResponseError } from "../error/response-error"
import Status from "../types/status"
import RoleService from "./role-service"
import TransactionService from "./transaction-service"

export default class AssetService {
    static async index(): Promise<any> {
        const assets = Asset.find({
            relations: ["transactions.role"],
        })
        return assets
    }

    static async show(id: string): Promise<any> {
        const asset = await Asset.findOne({
            where: { id },
            relations: ["transactions.role"],
        })
        return asset
    }

    static async create(name: string): Promise<any> {
        const asset = new Asset()
        asset.name = name
        asset.generateId()
        await asset.save()
        const roles = await RoleService.index()
        await Promise.all(
            roles.slice(1).map(role => TransactionService.create(asset, role))
        )
        return asset
    }

    private static async updateStatus(id: string, role: string, status: Status): Promise<any> {
        const asset = await Asset.findOne({
            where: { id },
            relations: ["transactions.role"],
            order: {
                transactions: {
                    role: {
                        order: "ASC",
                    },
                },
            },
        })

        if (!asset) {
            throw new ResponseError(404, "Asset not found")
        }

        const transactions = asset.transactions
        const transaction = transactions.find(transaction => transaction.role.name === role)

        if (!transaction) {
            throw new ResponseError(403, `You do not have permission to ${status} this asset.`)
        }

        const transactionIndex = transactions.indexOf(transaction)
        const previousTransaction = transactionIndex > 0 ? transactions[transactionIndex - 1] : null

        if (previousTransaction) {
            if (previousTransaction.status === Status.Rejected) {
                throw new ResponseError(403, `You cannot ${status} this transaction because ${previousTransaction.role.name} transaction was rejected`)
            } 
            if (previousTransaction.status === Status.Pending) {
                throw new ResponseError(403, `You cannot ${status} this transaction because ${previousTransaction.role.name} transaction is still pending`)
            }
        }

        switch (status) {
            case Status.Approved:
                await TransactionService.approve(transaction.id, role);
                break;
            case Status.Rejected:
                await TransactionService.reject(transaction.id, role);
                break;
            default:
                throw new ResponseError(400, `Invalid status: ${status}`);
        }
        
    }

    static async approve(id: string, role: string): Promise<any> {
        return await this.updateStatus(id, role, Status.Approved)
    }

    static async reject(id: string, role: string): Promise<any> {
        return await this.updateStatus(id, role, Status.Rejected)
    }
}
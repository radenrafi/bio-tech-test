import { Asset } from "../entities/asset-entity"
import { Role, RoleEnum } from "../entities/role-entity"
import { Transaction } from "../entities/transaction-entity"
import { ResponseError } from "../error/response-error"
import Status from "../types/status"

export default class TransactionService {
    static async index(): Promise<any> {
        const transactions = Transaction.find()
        return transactions
    }

    static async show(id: string): Promise<any> {
        const transaction = await Transaction.findOne({
            where: { id },
            relations: ["role"],
        })
        return transaction
    }

    static async create(asset: Asset, role: Role): Promise<any> {
        const transaction = new Transaction()
        transaction.asset = asset
        transaction.role = role
        transaction.status = Status.Pending
        transaction.generateId()
        await transaction.save()
        return transaction
    }

    private static async updateStatus(id: string, role: string, status: Status): Promise<any> {
        const transaction = await Transaction.findOne({
            where: { id },
            relations: ["role"],
        })

        if (!transaction) {
            throw new ResponseError(404, `Transaction not found.`)
        }
        if (role !== transaction.role.name) {
            throw new ResponseError(403, `You do not have permission to ${status} this transaction because it is owned by ${transaction.role.name} and not ${role}.`)
        }
        if (transaction.status !== Status.Pending) {
            throw new ResponseError(403, `Cannot ${status} a transaction that is not pending.`)
        }

        transaction.status = status
        await transaction.save()
        return transaction
    }

    static async approve(id: string, role: string): Promise<any> {
        return await this.updateStatus(id, role, Status.Approved)
    }

    static async reject(id: string, role: string): Promise<any> {
        return await this.updateStatus(id, role, Status.Rejected)
    }
}
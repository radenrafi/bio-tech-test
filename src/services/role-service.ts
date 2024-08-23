import { Role } from "../entities/role-entity"

export default class RoleService {
    static async index(): Promise<Role[]> {
        const roles = Role.find({
            order: {
                order: "ASC",
            }
        })
        return roles
    }
}
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { User } from '../entities/user-entity'
import * as bcrypt from 'bcrypt'
import { Role, RoleEnum } from '../entities/role-entity'
import { v7 as uuid } from 'uuid'

export class MainSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
		const roleRepository = dataSource.getRepository(Role)
		const userRepository = dataSource.getRepository(User)

		const roles = [
            { id: uuid(), name: RoleEnum.Operator, order: 0 },
            { id: uuid(), name: RoleEnum.Supervisor, order: 1 },
            { id: uuid(), name: RoleEnum.Manager, order: 2 },
        ];

		for (const roleData of roles) {
            const role = roleRepository.create(roleData);
            await roleRepository.save(role);
        }

		const operatorRole = await roleRepository.findOne({ where: { name: RoleEnum.Operator } });
        const supervisorRole = await roleRepository.findOne({ where: { name: RoleEnum.Supervisor } });
        const managerRole = await roleRepository.findOne({ where: { name: RoleEnum.Manager } });

		const predefinedUsers: Partial<User>[] = [
            {
                name: 'User Operator',
                username: 'user_operator',
                email: 'user_operator@example.com',
                password: bcrypt.hashSync('password', 10),
                role: operatorRole,
            },
            {
                name: 'User Supervisor',
                username: 'user_supervisor',
                email: 'user_supervisor@example.com',
                password: bcrypt.hashSync('password', 10),
                role: supervisorRole,
            },
            {
                name: 'User Manager',
                username: 'user_manager',
                email: 'user_manager@example.com',
                password: bcrypt.hashSync('password', 10),
                role: managerRole,
            },
        ]

		for (const userData of predefinedUsers) {
            const user = userRepository.create(userData);
            await userRepository.save(user)
        }
	}
}

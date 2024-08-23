import { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_LOG } from './environment'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { SeederOptions } from 'typeorm-extension'
import { MainSeeder } from '../seed/main-seeder'
import { DataSourceOptions } from 'typeorm'

export const options: DataSourceOptions & SeederOptions = {
	type: 'postgres',
	host: DB_HOST,
	port: DB_PORT,
	username: DB_USERNAME,
	password: DB_PASSWORD,
	database: DB_NAME,
	synchronize: false,
	logging: DB_LOG,
	entities: ['./src/entities/*.ts'],
	migrations: ['./typeorm/migrations/*.ts'],
	namingStrategy: new SnakeNamingStrategy(),
	seeds: [MainSeeder],
}

export default options

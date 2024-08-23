import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension'
import options from '../config/db-options';

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
	await runSeeders(dataSource)
	process.exit()
})

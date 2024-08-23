import { DataSource, DataSourceOptions } from 'typeorm'
import options from './db-options'

export const dataSource = new DataSource(options)
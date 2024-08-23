import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
	dotenv.config({ path: '.env' })
} else {
	dotenv.config({ path: '.env.example' })
}

export const APP_NAME: string = process.env.APP_NAME || 'app-dev'
export const APP_DEBUG: boolean = Boolean(process.env.APP_DEBUG) || false
export const APP_ENV: string = process.env.APP_ENV || 'local'
export const APP_PORT: number = parseInt(process.env.APP_PORT as any) || 3000
export const APP_SECRET: string = process.env.APP_SECRET || ''

export const DB_HOST: string = process.env.DB_HOST || ''
export const DB_USERNAME: string = process.env.DB_USERNAME || ''
export const DB_PASSWORD: string = process.env.DB_PASSWORD || ''
export const DB_NAME: string = process.env.DB_NAME || ''
export const DB_PORT: number = parseInt(process.env.DB_PORT as any) || 5432
export const DB_LOG: boolean = Boolean(process.env.DB_LOG) || false

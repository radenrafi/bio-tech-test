import type { Config } from 'jest'

const config: Config = {
	testEnvironment: 'node',
	transform: {
		'^.+\\.[t|j]sx?$': 'babel-jest',
	},
	setupFiles: ['./jest-setup-file.ts'],
}

export default config

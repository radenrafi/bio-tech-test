import { ZodError } from 'zod'

export const formatZodError = (error: ZodError): string | null => {
	const { issues } = error
	let err = {} as any

	if (issues.length) {
		issues.forEach((item) => {
			const { path, message, code } = item
			err[path.join('.')] = {
				code,
				message,
			}
		})
		return err
	}
	return null
}

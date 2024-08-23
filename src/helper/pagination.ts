import { Request, Response } from 'express'

interface Page {
	offset: number
	size: number
}

interface Meta {
	total: number
	total_current: number
	page: number
	page_total: number
	limit: number
}

interface PaginationLinks {
	first_page: string
	next_page: string | null
	previous_page: string | null
	last_page: string
}

interface ResponseData<T> {
	meta: Meta
	data: T
	page: PaginationLinks
}

const setUrl = (req: Request): string => {
	const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`
	const queryParams = new URLSearchParams(req.query as any)
	queryParams.delete('page')
	queryParams.delete('limit')
	return `${baseUrl}?${queryParams.toString()}`
}

const paginate = <T>(req: Request, res: Response, page: Page, total: number, data: T[]): Response => {
	const url = setUrl(req)
	const pages = page.offset / page.size + 1
	const lastPage = Math.ceil(total / page.size)
	let nextPage: number | null = pages + 1
	let prevPage: number | null = pages - 1
	if (nextPage > lastPage) nextPage = null
	if (prevPage === 0) prevPage = null

	const response: ResponseData<T[]> = {
		meta: {
			total,
			total_current: data.length,
			page: pages,
			page_total: lastPage,
			limit: page.size,
		},
		data,
		page: {
			first_page: `${url}page=1&limit=${page.size}`,
			next_page: nextPage ? `${url}page=${nextPage}&limit=${page.size}` : null,
			previous_page: prevPage ? `${url}page=${prevPage}&limit=${page.size}` : null,
			last_page: `${url}page=${lastPage}&limit=${page.size}`,
		},
	}

	return res.status(200).json(response)
}

export default paginate

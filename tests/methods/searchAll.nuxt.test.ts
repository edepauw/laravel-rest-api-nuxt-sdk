import { describe, it, expect, vi, beforeEach } from 'vitest'
import searchAll from '../../src/runtime/methods/searchAll'
import search from '../../src/runtime/methods/search'

vi.mock('../../src/runtime/methods/search', () => ({
	default: vi.fn(),
}))

const mockSearch = vi.mocked(search)

describe('searchAll method', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should fetch all pages and aggregate data', async () => {
		mockSearch
			.mockResolvedValueOnce({
				data: [{ id: 1 }, { id: 2 }],
				current_page: 1,
				last_page: 3,
				per_page: 2,
				total: 6,
				from: 1,
				to: 2,
				total_pages: 3,
				meta: { some: 'meta' },
				nextPage: vi.fn(),
				previousPage: vi.fn(),
				goToPage: vi.fn(),
			})
			.mockResolvedValueOnce({
				data: [{ id: 3 }, { id: 4 }],
				current_page: 2,
				last_page: 3,
				per_page: 2,
				total: 6,
				from: 3,
				to: 4,
				total_pages: 3,
				meta: { some: 'meta' },
				nextPage: vi.fn(),
				previousPage: vi.fn(),
				goToPage: vi.fn(),
			})
			.mockResolvedValueOnce({
				data: [{ id: 5 }, { id: 6 }],
				current_page: 3,
				last_page: 3,
				per_page: 2,
				total: 6,
				from: 5,
				to: 6,
				total_pages: 3,
				meta: { some: 'meta' },
				nextPage: vi.fn(),
				previousPage: vi.fn(),
				goToPage: vi.fn(),
			})

		const api = vi.fn()
		const result = await searchAll({}, api)

		expect(mockSearch).toHaveBeenCalledTimes(3)
		expect(mockSearch).toHaveBeenNthCalledWith(1, { page: 1 }, api)
		expect(mockSearch).toHaveBeenNthCalledWith(2, { page: 2 }, api)
		expect(mockSearch).toHaveBeenNthCalledWith(3, { page: 3 }, api)

		expect(result.data).toEqual([
			{ id: 1 }, { id: 2 },
			{ id: 3 }, { id: 4 },
			{ id: 5 }, { id: 6 },
		])
		expect(result.total).toBe(6)
		expect(result.per_page).toBe(2)
		expect(result.meta).toEqual({ some: 'meta' })
	})

	it('should handle single page response', async () => {
		mockSearch.mockResolvedValueOnce({
			data: [{ id: 1 }],
			current_page: 1,
			last_page: 1,
			per_page: 10,
			total: 1,
			from: 1,
			to: 1,
			total_pages: 1,
			meta: null,
			nextPage: vi.fn(),
			previousPage: vi.fn(),
			goToPage: vi.fn(),
		})

		const api = vi.fn()
		const result = await searchAll({}, api)

		expect(mockSearch).toHaveBeenCalledTimes(1)
		expect(result.data).toEqual([{ id: 1 }])
		expect(result.total).toBe(1)
	})

	it('should forward search query to each page call', async () => {
		mockSearch.mockResolvedValueOnce({
			data: [{ id: 1 }],
			current_page: 1,
			last_page: 1,
			per_page: 10,
			total: 1,
			from: 1,
			to: 1,
			total_pages: 1,
			meta: null,
			nextPage: vi.fn(),
			previousPage: vi.fn(),
			goToPage: vi.fn(),
		})

		const api = vi.fn()
		const query = { filters: [{ field: 'name', value: 'test' }] }
		await searchAll(query, api)

		expect(mockSearch).toHaveBeenCalledWith(
			{ filters: [{ field: 'name', value: 'test' }], page: 1 },
			api
		)
	})
})

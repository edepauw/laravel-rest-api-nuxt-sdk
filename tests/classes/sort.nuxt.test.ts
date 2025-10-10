import { describe, it, expect } from 'vitest'
import { SortBuilder } from '../../src/runtime/queryBuilders/searchClass/sort'

describe('SortBuilder', () => {
    it('should return an empty array if no sort is added', () => {
        const builder = new SortBuilder()
        expect(builder.build()).toEqual([])
    })

    it('should add a single sort with asc direction', () => {
        const builder = new SortBuilder()
        builder.addSort({ field: 'name', direction: 'asc' })

        expect(builder.build()).toEqual([{ field: 'name', direction: 'asc' }])
    })

    it('should add a single sort with desc direction', () => {
        const builder = new SortBuilder()
        builder.addSort({ field: 'date', direction: 'desc' })

        expect(builder.build()).toEqual([{ field: 'date', direction: 'desc' }])
    })

    it('should accumulate multiple sorts', () => {
        const builder = new SortBuilder()
        builder
            .addSort({ field: 'name', direction: 'asc' })
            .addSort({ field: 'date', direction: 'desc' })

        expect(builder.build()).toEqual([
            { field: 'name', direction: 'asc' },
            { field: 'date', direction: 'desc' }
        ])
    })
})
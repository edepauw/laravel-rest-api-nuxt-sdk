import { describe, it, expect } from 'vitest'
import { FilterBuilder } from '../../src/runtime/queryBuilders/searchClass/filter'
import type { IFilter } from '../../src/runtime/types/search'

type DummyModel = { id: number; status: string }

describe('FilterBuilder', () => {
    it('should return empty array when no filters are added', () => {
        const builder = new FilterBuilder<DummyModel>()
        expect(builder.build()).toEqual([])
    })

    it('should add a single filter', () => {
        const builder = new FilterBuilder<DummyModel>()
        builder.addFilter({
            field: 'status',
            operator: '=',
            value: 'active',
            type: 'and'
        })

        expect(builder.build()).toEqual([
            {
                field: 'status',
                operator: '=',
                value: 'active',
                type: 'and',
                nested: undefined
            }
        ])
    })

    it('should add a single nested filter', () => {
        const builder = new FilterBuilder<DummyModel>()
        builder.addNestedFilter({
            field: 'category',
            operator: '=',
            value: 'books',
            type: 'or'
        })

        expect(builder.build()).toEqual([
            {
                field: 'category',
                operator: '=',
                value: 'books',
                type: 'or',
                nested: undefined
            }
        ])
    })

    it('should add multiple filters and nested filters', () => {
        const builder = new FilterBuilder<DummyModel>()
        builder
            .addFilter({
                field: 'status',
                operator: '=',
                value: 'active',
                type: 'and'
            })
            .addNestedFilter({
                field: 'type',
                operator: 'in',
                value: ['free', 'paid'],
                type: 'or'
            })

        expect(builder.build()).toEqual([
            {
                field: 'status',
                operator: '=',
                value: 'active',
                type: 'and',
                nested: undefined
            },
            {
                field: 'type',
                operator: 'in',
                value: ['free', 'paid'],
                type: 'or',
                nested: undefined
            }
        ])
    })

    it('should add a filter with nested filters inside', () => {
        const nested: IFilter<DummyModel>[] = [
            { field: 'status', operator: '=', value: 'pending', type: 'and' },
            { field: 'priority', operator: '>=', value: 2, type: 'and' }
        ]

        const builder = new FilterBuilder<DummyModel>()
        builder.addFilter({
            type: 'or',
            nested
        })

        expect(builder.build()).toEqual([
            {
                field: undefined,
                value: undefined,
                operator: undefined,
                type: 'or',
                nested
            }
        ])
    })
})
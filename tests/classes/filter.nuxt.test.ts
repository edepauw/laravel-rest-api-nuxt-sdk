import { describe, it, expect } from 'vitest'
import { FilterBuilder } from '../../src/runtime/queryBuilders/searchClass/filter'

type DummyModel = { id: number; status: string }

describe('FilterBuilder', () => {
    it('should return empty array when no filters are added', () => {
        const builder = new FilterBuilder<DummyModel>()
        expect(builder.build()).toEqual([])
    })

    it('should add a single filter', () => {
        const builder = new FilterBuilder<DummyModel>()
        builder.addFilter('status', 'active','=', 'and')

        expect(builder.build()).toEqual([
            {
                field: 'status',
                operator: '=',
                value: 'active',
                type: 'and'
            }
        ])
    })

    it('should add a single nested filter', () => {
        const builder = new FilterBuilder<DummyModel>()
        builder.addNestedFilter([
            {
                field: 'category',
                value: 'books',
                operator: '=',
                type: 'or'
            }
        ])

        expect(builder.build()).toEqual([
            {
                nested: [
                    {
                        field: 'category',
                        value: 'books',
                        operator: '=',
                        type: 'or'
                    }
                ]
            }
        ])
    })

    it('should add multiple filters and nested filters', () => {
        const builder = new FilterBuilder<DummyModel>()
        builder
            .addFilter('status', 'active')
            .addFilter('status', 'inactive','=',  'or')
            .addNestedFilter([{
                field: 'type',
                operator: 'in',
                value: ['free', 'paid'],
                type: 'or'
            }])

        expect(builder.build()).toEqual([
            {
                field: 'status',
                value: 'active'
            },
            {
                field: 'status',
                operator: '=',
                value: 'inactive',
                type: 'or'
            },
            {
                nested: [
                    {
                        field: 'type',
                        operator: 'in',
                        value: ['free', 'paid'],
                        type: 'or'
                    }
                ]
            }
        ])
    })
})
import { describe, it, expect } from 'vitest'
import { AggregateBuilder } from '../../src/runtime/queryBuilders/searchClass/aggregate'
import type { IFilter } from '../../src/runtime/types/search'

type DummyModel = { id: number; status: string }

describe('AggregateBuilder', () => {
    it('should return an empty array if no aggregate is added', () => {
        const builder = new AggregateBuilder<DummyModel>()
        const result = builder.build()
        expect(result).toEqual([])
    })

    it('should add a basic aggregate with required fields only', () => {
        const builder = new AggregateBuilder<DummyModel>()
        builder.addAggregates({
            relation: 'orders',
            type: 'count'
        })

        const result = builder.build()

        expect(result).toEqual([
            {
                relation: 'orders',
                type: 'count',
                field: undefined,
                filters: undefined
            }
        ])
    })

    it('should add an aggregate with all fields', () => {
        const filters: IFilter<DummyModel>[] = [
            {
                field: 'status',
                operator: '=',
                value: 'active',
                type: 'and'
            }
        ]

        const builder = new AggregateBuilder<DummyModel>()
        builder.addAggregates({
            relation: 'products',
            type: 'avg',
            field: 'price',
            filters
        })

        const result = builder.build()

        expect(result).toEqual([
            {
                relation: 'products',
                type: 'avg',
                field: 'price',
                filters
            }
        ])
    })

    it('should allow adding multiple aggregates', () => {
        const builder = new AggregateBuilder<DummyModel>()
        builder
            .addAggregates({ relation: 'orders', type: 'count' })
            .addAggregates({ relation: 'products', type: 'sum', field: 'quantity' })

        const result = builder.build()

        expect(result).toEqual([
            {
                relation: 'orders',
                type: 'count',
                field: undefined,
                filters: undefined
            },
            {
                relation: 'products',
                type: 'sum',
                field: 'quantity',
                filters: undefined
            }
        ])
    })
})
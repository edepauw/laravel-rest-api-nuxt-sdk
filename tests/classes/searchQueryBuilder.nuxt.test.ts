import {describe, it, expect} from 'vitest'
import {SearchQueryBuilder} from '../../src/runtime/queryBuilders/searchQueryBuilder'
import {
    IAggregate,
    IFilter,
    IGate,
    IInclude,
    IInstruction,
    IScopes,
    ISelect,
    ISort,
    IText
} from "../../src/runtime/types/search";

type DummyType = { id: number }

const text: IText = {value: 'recherche'}
const scopes: IScopes[] = [{name: 'scope1', parameters: ['param1']}]
const filters: IFilter<DummyType>[] = [{field: 'status', operator: '=', value: 'active', type: 'and'}]
const sorts: ISort[] = [{field: 'createdAt', direction: 'desc'}]
const selects: ISelect[] = [{field: 'id'}]
const includes: IInclude<DummyType>[] = [{
    relation: 'user',
    filters: [{field: 'email', operator: 'like', value: '%@example.com'}]
}]
const aggregates: IAggregate<DummyType>[] = [{
    relation: 'orders',
    type: 'count',
    field: 'total'
}]
const instructions: IInstruction[] = [{name: 'includeDeleted', fields: ['*']}]
const gates: IGate[] = [{gates: ['admin']}]
const page: number = 2
const limit: number = 50

describe('SearchQueryBuilder', () => {
    it('should build an empty query by default', () => {
        const builder = new SearchQueryBuilder<DummyType>()
        const result = builder.build()
        expect(result).toEqual({})
    })

    it('should build query with only text', () => {
        const builder = new SearchQueryBuilder<DummyType>().setText(text)
        const result = builder.build()
        expect(result).toEqual({text})
    })

    it('should build query with all fields', () => {
        const builder = new SearchQueryBuilder<DummyType>()
            .setText(text)
            .setScopes(scopes)
            .setFilters(filters)
            .setSorts(sorts)
            .setSelects(selects)
            .setIncludes(includes)
            .setAggregates(aggregates)
            .setInstructions(instructions)
            .setGates(gates)
            .setPage(page)
            .setLimit(limit)

        const result = builder.build()

        expect(result).toEqual({
            text,
            scopes,
            filters,
            sorts,
            selects,
            includes,
            aggregates,
            instructions,
            gates,
            page,
            limit
        })
    })

    it('should ignore fields with default/empty values', () => {
        const builder = new SearchQueryBuilder<DummyType>()
            .setText({value: ''})
            .setPage(0)
            .setLimit(0)

        const result = builder.build()

        expect(result).toEqual({})
    })

    it('should support chaining of methods', () => {
        const result = new SearchQueryBuilder<DummyType>()
            .setText(text)
            .setFilters(filters)
            .setLimit(limit)
            .build()

        expect(result).toEqual({
            text,
            filters,
            limit
        })
    })

    it('should handle includes with nested filters', () => {
        const nestedFiltersInIncludes: IInclude<DummyType>[] = [{
            relation: 'comments',
            filters: [{field: 'approved', operator: '=', value: true}]
        }]

        const builder = new SearchQueryBuilder<DummyType>().setIncludes(nestedFiltersInIncludes)
        const result = builder.build()
        expect(result.includes).toEqual(nestedFiltersInIncludes)
    })
})

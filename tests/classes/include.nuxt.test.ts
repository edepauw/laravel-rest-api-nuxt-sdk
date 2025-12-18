import { describe, it, expect } from 'vitest'
import { IncludeBuilder } from '../../src/runtime/queryBuilders/searchClass/include'
import type { IInclude } from '../../src/runtime/types/search'

type DummyModel = { id: number; name: string }

describe('IncludeBuilder', () => {
    it('should return an empty array when no include is added', () => {
        const builder = new IncludeBuilder<DummyModel>()
        expect(builder.build()).toEqual([])
    })

    it('should add a simple include with only relation', () => {
        const builder = new IncludeBuilder<DummyModel>()
        builder.addInclude({ relation: 'author' })

        expect(builder.build()).toEqual([
            { relation: 'author' }
        ])
    })

    it('should add an include with all optional parameters', () => {
        const builder = new IncludeBuilder<DummyModel>()

        const includePayload: IInclude<DummyModel> = {
            relation: 'comments',
            text: { value: 'hello' },
            scopes: [{ name: 'recent' }],
            filters: [{ field: 'status', operator: '=', value: 'active', type: 'and' }],
            sorts: [{ field: 'created_at', direction: 'desc' }],
            selects: [{ field: 'id' }],
            includes: [{ relation: 'user' }],
            aggregates: [{ relation: 'likes', type: 'count' }],
            instructions: [{ name: 'someInstruction' }],
            gates: [{ gates: ['can:view'] }],
            page: 2,
            limit: 10
        }

        builder.addInclude(includePayload)

        expect(builder.build()).toEqual([includePayload])
    })

    it('should accumulate multiple includes', () => {
        const builder = new IncludeBuilder<DummyModel>()
        builder
            .addInclude({ relation: 'author' })
            .addInclude({ relation: 'tags' })

        expect(builder.build()).toEqual([
            { relation: 'author' },
            { relation: 'tags' }
        ])
    })
})

import { describe, it, expect } from 'vitest'
import { ScopeBuilder } from '../../src/runtime/queryBuilders/searchClass/scope'

describe('ScopeBuilder', () => {
    it('should return an empty array if no scope is added', () => {
        const builder = new ScopeBuilder()
        expect(builder.build()).toEqual([])
    })

    it('should add a single scope with only name', () => {
        const builder = new ScopeBuilder()
        builder.addScope('activeUsers')

        expect(builder.build()).toEqual([{ name: 'activeUsers' }])
    })

    it('should add a single scope with name and parameters', () => {
        const builder = new ScopeBuilder()
        builder.addScope('dateRange', ['2023-01-01', '2023-12-31'])

        expect(builder.build()).toEqual([{ name: 'dateRange', parameters: ['2023-01-01', '2023-12-31'] }])
    })

    it('should accumulate multiple scopes', () => {
        const builder = new ScopeBuilder()
        builder
            .addScope('activeUsers')
            .addScope('premiumUsers', [true])

        expect(builder.build()).toEqual([
            { name: 'activeUsers' },
            { name: 'premiumUsers', parameters: [true] }
        ])
    })
})
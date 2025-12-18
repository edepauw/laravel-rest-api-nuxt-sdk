import { describe, it, expect } from 'vitest'
import { IGateBuilder } from '../../src/runtime/queryBuilders/searchClass/gate'

describe('IGateBuilder', () => {
    it('should return an empty array if no gate is added', () => {
        const builder = new IGateBuilder()
        const result = builder.build()
        expect(result).toEqual([])
    })

    it('should add a single gate', () => {
        const builder = new IGateBuilder()
        builder.addGate(['can:view'])

        const result = builder.build()
        expect(result).toEqual([
            { gates: ['can:view'] }
        ])
    })

    it('should add multiple gates', () => {
        const builder = new IGateBuilder()
        builder
            .addGate(['can:create'])
            .addGate(['can:edit'])

        const result = builder.build()
        expect(result).toEqual([
            { gates: ['can:create'] },
            { gates: ['can:edit'] }
        ])
    })

    it('should support complex gate structures', () => {
        const complexGate = [
            { and: ['can:view', 'can:delete'] },
            { or: ['can:edit', 'can:update'] }
        ]

        const builder = new IGateBuilder()
        builder.addGate(complexGate)

        const result = builder.build()
        expect(result).toEqual([
            { gates: complexGate }
        ])
    })
})
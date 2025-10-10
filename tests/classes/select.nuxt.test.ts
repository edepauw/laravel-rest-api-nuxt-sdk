import { describe, it, expect } from 'vitest'
import { SelectBuilder } from '../../src/runtime/queryBuilders/searchClass/select'

describe('SelectBuilder', () => {
    it('should return an empty array if no select is added', () => {
        const builder = new SelectBuilder()
        expect(builder.build()).toEqual([])
    })

    it('should add a single select field', () => {
        const builder = new SelectBuilder()
        builder.addSelect('name')

        expect(builder.build()).toEqual([{ field: 'name' }])
    })

    it('should accumulate multiple select fields', () => {
        const builder = new SelectBuilder()
        builder
            .addSelect('name')
            .addSelect('email')
            .addSelect('age')

        expect(builder.build()).toEqual([
            { field: 'name' },
            { field: 'email' },
            { field: 'age' }
        ])
    })
})
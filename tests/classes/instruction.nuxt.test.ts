import { describe, it, expect } from 'vitest'
import { IInstructionBuilder } from '../../src/runtime/queryBuilders/searchClass/instruction'

describe('IInstructionBuilder', () => {
    it('should return an empty array if no instruction is added', () => {
        const builder = new IInstructionBuilder()
        expect(builder.build()).toEqual([])
    })

    it('should add a single instruction with only name', () => {
        const builder = new IInstructionBuilder()
        builder.addInstruction({ name: 'resetCache' })

        expect(builder.build()).toEqual([{ name: 'resetCache' }])
    })

    it('should add a single instruction with name and fields', () => {
        const builder = new IInstructionBuilder()
        builder.addInstruction({ name: 'sendEmail', fields: ['to', 'subject'] })

        expect(builder.build()).toEqual([{ name: 'sendEmail', fields: ['to', 'subject'] }])
    })

    it('should accumulate multiple instructions', () => {
        const builder = new IInstructionBuilder()
        builder
            .addInstruction({ name: 'clearLogs' })
            .addInstruction({ name: 'notifyAdmin', fields: ['level', 'message'] })

        expect(builder.build()).toEqual([
            { name: 'clearLogs' },
            { name: 'notifyAdmin', fields: ['level', 'message'] }
        ])
    })
})

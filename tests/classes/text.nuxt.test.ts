import { describe, it, expect } from 'vitest'
import { TextBuilder } from '../../src/runtime/queryBuilders/searchClass/text'

describe('TextBuilder', () => {
    it('should return empty value by default', () => {
        const builder = new TextBuilder()
        expect(builder.build()).toEqual({ value: "" })
    })

    it('should set text value with addText', () => {
        const builder = new TextBuilder()
        builder.addText('hello world')
        expect(builder.build()).toEqual({ value: 'hello world' })
    })

    it('should set text value and trashed value with addText', () => {
        const builder = new TextBuilder()
        builder.addText('hello world', "with")
        expect(builder.build()).toEqual({ value: 'hello world', trashed: "with" })
    })

    it('should overwrite text value if addText called multiple times', () => {
        const builder = new TextBuilder()
        builder.addText('first')
        builder.addText('second')
        expect(builder.build()).toEqual({ value: 'second' })
    })
})

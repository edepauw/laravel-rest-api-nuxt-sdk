import { describe, it, expect } from 'vitest'
import { MutateRelationBuilder, MutateArrayBuilder } from '../../src/runtime/queryBuilders/mutateQueryBuilder'

// Dummy type pour simuler un modèle
type DummyModel = {
    name: string
    email: string
}

describe('MutateRelationBuilder', () => {
    it('should build a create relation request', () => {
        const result = MutateRelationBuilder.create()
            .setAttributes({ foo: 'bar' })
            .setPivot({ active: true })
            .build()

        expect(result).toEqual({
            operation: 'create',
            attributes: { foo: 'bar' },
            pivot: { active: true }
        })
    })

    it('should build an attach relation request with key', () => {
        const result = MutateRelationBuilder.attach(123).build()

        expect(result).toEqual({
            operation: 'attach',
            key: 123
        })
    })

    it('should build a detach relation request with key', () => {
        const result = MutateRelationBuilder.detach(456).build()

        expect(result).toEqual({
            operation: 'detach',
            key: 456
        })
    })

    it('should build an update relation with key and attributes', () => {
        const result = MutateRelationBuilder.update('abc')
            .setAttributes({ updated: true })
            .build()

        expect(result).toEqual({
            operation: 'update',
            key: 'abc',
            attributes: { updated: true }
        })
    })

    it('should build a sync relation with without_detaching', () => {
        const result = MutateRelationBuilder.sync(789, true)
            .build()

        expect(result).toEqual({
            operation: 'sync',
            key: 789,
            without_detaching: true
        })
    })

    it('should build a toggle relation request with key', () => {
        const result = MutateRelationBuilder.toggle(99).build()

        expect(result).toEqual({
            operation: 'toggle',
            key: 99
        })
    })

    it('should add nested relations', () => {
        const nestedRelation = MutateRelationBuilder.create().build()
        const result = MutateRelationBuilder.create()
            .addRelation('child', nestedRelation)
            .build()

        expect(result).toEqual({
            operation: 'create',
            relations: {
                child: nestedRelation
            }
        })
    })
})

describe('MutateArrayBuilder', () => {
    it('should build an array of create requests', () => {
        const builder = new MutateArrayBuilder<DummyModel>()
        builder
            .addCreate({ name: 'John' })
            .end()

        const result = builder.build()
    console.log(result)
        expect(result).toEqual([
            {
                operation: 'create',
                attributes: { name: 'John' }
            }
        ])
    })

    it('should build an array with update including key and attributes', () => {
        const builder = new MutateArrayBuilder<DummyModel>()
        builder
            .addUpdate(42, { email: 'test@example.com' })
            .end()

        const result = builder.build()

        expect(result).toEqual([
            {
                operation: 'update',
                key: 42,
                attributes: { email: 'test@example.com' }
            }
        ])
    })

    it('should build an update with relation and without_detaching', () => {
        const relation = MutateRelationBuilder.attach(1).build()

        const builder = new MutateArrayBuilder<DummyModel>()
        builder
            .addUpdate(1, { name: 'Updated' })
            .addRelation('roles', relation)
            .setWithoutDetaching(true)
            .end()

        const result = builder.build()

        expect(result).toEqual([
            {
                operation: 'update',
                key: 1,
                attributes: { name: 'Updated' },
                relations: {
                    roles: relation
                },
                without_detaching: true
            }
        ])
    })

    it('should return empty array if nothing added', () => {
        const builder = new MutateArrayBuilder<DummyModel>()
        const result = builder.build()
        expect(result).toEqual([])
    })
})
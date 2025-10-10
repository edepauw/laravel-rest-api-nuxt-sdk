import type {IMutateRelationRequest, IMutateRequest} from "../types/mutate";

class MutateRelationBuilder {
    private relation: Partial<IMutateRelationRequest> = {};

    private constructor(op: string) {
        this.relation.operation = op as any;
    }

    static create(): MutateRelationBuilder {
        return new MutateRelationBuilder('create');
    }

    static attach(key: number | string): MutateRelationBuilder {
        return new MutateRelationBuilder('attach').setKey(key);
    }

    static detach(key: number | string): MutateRelationBuilder {
        return new MutateRelationBuilder('detach').setKey(key);
    }

    static update(key: number | string): MutateRelationBuilder {
        return new MutateRelationBuilder('update').setKey(key);
    }

    static sync(key: number | string, withoutDetaching = false): MutateRelationBuilder {
        return new MutateRelationBuilder('sync')
            .setKey(key)
            .setWithoutDetaching(withoutDetaching);
    }

    static toggle(key: number | string): MutateRelationBuilder {
        return new MutateRelationBuilder('toggle').setKey(key);
    }

    setAttributes(attributes: any): this {
        this.relation.attributes = attributes;
        return this;
    }

    setPivot(pivot: any): this {
        this.relation.pivot = pivot;
        return this;
    }

    setKey(key: number | string): this {
        (this.relation as any).key = key;
        return this;
    }

    setWithoutDetaching(flag: boolean): this {
        if (this.relation.operation === 'sync') {
            (this.relation as any).without_detaching = flag;
        }
        return this;
    }

    addRelation(
        relationName: string,
        relation: IMutateRelationRequest | IMutateRelationRequest[]
    ): this {
        if (!this.relation.relations) this.relation.relations = {};
        this.relation.relations[relationName] = relation;
        return this;
    }

    build(): IMutateRelationRequest {
        return this.relation as IMutateRelationRequest;
    }
}


class MutateItemBuilder<T> {
    request: Partial<IMutateRequest<T>>;
    parent: MutateArrayBuilder<T>;

    constructor(operation: 'create' | 'update', parent: MutateArrayBuilder<T>, key?: number | string, attributes?: T) {
        this.parent = parent;
        this.request = {operation};
        if(attributes !== undefined)
            (this.request as any).attributes = attributes;
        if (operation === 'update' && key !== undefined) {
             (this.request as any).key = key;
        }
    }

    addRelation(name: string, relation: IMutateRelationRequest | IMutateRelationRequest[]): this {
        if (!this.request.relations) this.request.relations = {};
        this.request.relations[name] = relation;
        return this;
    }

    setWithoutDetaching(flag: boolean): this {
        if (this.request.operation === 'update') {
            (this.request as any).without_detaching = flag;
        }
        return this;
    }

    end(): MutateArrayBuilder<T> {
        this.parent.push(this.request as IMutateRequest<T>);
        return this.parent;
    }

    build(): IMutateRequest<T> {
        return this.request as IMutateRequest<T>;
    }
}

class MutateArrayBuilder<T> {
    private requests: IMutateRequest<T>[] = [];

    addCreate(attributes?: any): MutateItemBuilder<T> {
        return new MutateItemBuilder('create', this, undefined, attributes);
    }

    addUpdate(key: number | string, attributes?: any): MutateItemBuilder<T> {
        return new MutateItemBuilder('update', this, key, attributes);
    }

    push(request: IMutateRequest<T>): void {
        this.requests.push(request);
    }

    build(): IMutateRequest<T>[] {
        return this.requests;
    }
}

export {MutateRelationBuilder, MutateArrayBuilder};
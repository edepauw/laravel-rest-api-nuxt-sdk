import type { IMutateRelationRequest, IMutateRequest } from "../types/mutate";

class MutateRelationBuilder {
    private relation: Partial<IMutateRelationRequest> = {};

    private constructor(op: string) {
        this.relation.operation = op as any;
    }

    /**
     * Initializes a new relation with the `create` operation.
     * @author Robin DOUET
     * @description Prepares a relation to be created with optional attributes and nested relations.
     * @returns {MutateRelationBuilder}
     * @example
     * const relation = MutateRelationBuilder.create()
     *     .setAttributes({ name: 'Tag A' })
     *     .build();
     *
     * // JSON Output:
     * {
     *   "operation": "create",
     *   "attributes": { "name": "Tag A" }
     * }
     */
    static create(): MutateRelationBuilder {
        return new MutateRelationBuilder('create');
    }

    /**
     * Creates a new relation with the `attach` operation using a key.
     * @author Robin DOUET
     * @param {number | string} key - The identifier of the related model to attach.
     * @returns {MutateRelationBuilder}
     * @example
     * const relation = MutateRelationBuilder.attach(5).build();
     *
     * // JSON Output:
     * {
     *   "operation": "attach",
     *   "key": 5
     * }
     */
    static attach(key: number | string): MutateRelationBuilder {
        return new MutateRelationBuilder('attach').setKey(key);
    }

    /**
     * Creates a new relation with the `detach` operation using a key.
     * @author Robin DOUET
     * @param {number | string} key - The identifier of the related model to detach.
     * @returns {MutateRelationBuilder}
     * @example
     * const relation = MutateRelationBuilder.detach(10).build();
     *
     * // JSON Output:
     * {
     *   "operation": "detach",
     *   "key": 10
     * }
     */
    static detach(key: number | string): MutateRelationBuilder {
        return new MutateRelationBuilder('detach').setKey(key);
    }

    /**
     * Creates a new relation with the `update` operation.
     * @author Robin DOUET
     * @param {number | string} key - The identifier of the related model to update.
     * @returns {MutateRelationBuilder}
     * @example
     * const relation = MutateRelationBuilder.update(1)
     *     .setAttributes({ name: 'Updated Name' })
     *     .build();
     *
     * // JSON Output:
     * {
     *   "operation": "update",
     *   "key": 1,
     *   "attributes": { "name": "Updated Name" }
     * }
     */
    static update(key: number | string): MutateRelationBuilder {
        return new MutateRelationBuilder('update').setKey(key);
    }

    /**
     * Creates a new relation with the `sync` operation.
     * @author Robin DOUET
     * @param {number | string} key - The identifier of the related model to sync.
     * @param {boolean} [withoutDetaching=false] - Whether to avoid detaching existing relations.
     * @returns {MutateRelationBuilder}
     * @example
     * const relation = MutateRelationBuilder.sync(3, true)
     *     .setAttributes({ role: 'editor' })
     *     .build();
     *
     * // JSON Output:
     * {
     *   "operation": "sync",
     *   "key": 3,
     *   "without_detaching": true,
     *   "attributes": { "role": "editor" }
     * }
     */
    static sync(key: number | string, withoutDetaching = false): MutateRelationBuilder {
        return new MutateRelationBuilder('sync')
            .setKey(key)
            .setWithoutDetaching(withoutDetaching);
    }

    /**
     * Creates a new relation with the `toggle` operation.
     * @author Robin DOUET
     * @param {number | string} key - The identifier of the related model to toggle.
     * @returns {MutateRelationBuilder}
     * @example
     * const relation = MutateRelationBuilder.toggle(2).build();
     *
     * // JSON Output:
     * {
     *   "operation": "toggle",
     *   "key": 2
     * }
     */
    static toggle(key: number | string): MutateRelationBuilder {
        return new MutateRelationBuilder('toggle').setKey(key);
    }

    /**
     * Sets the attributes of the relation.
     * @author Robin DOUET
     * @param {any} attributes - Key-value pairs of attributes to assign.
     * @returns {this}
     * @example
     * builder.setAttributes({ active: true });
     */
    setAttributes(attributes: any): this {
        this.relation.attributes = attributes;
        return this;
    }

    /**
     * Sets pivot data (for many-to-many relations).
     * @author Robin DOUET
     * @param {any} pivot - Pivot table data.
     * @returns {this}
     * @example
     * builder.setPivot({ added_by: 'admin' });
     */
    setPivot(pivot: any): this {
        this.relation.pivot = pivot;
        return this;
    }

    /**
     * Sets the key of the relation (usually an ID).
     * @author Robin DOUET
     * @param {number | string} key - The identifier of the related model.
     * @returns {this}
     * @example
     * builder.setKey(1);
     */
    setKey(key: number | string): this {
        (this.relation as any).key = key;
        return this;
    }

    /**
     * Enables or disables the `without_detaching` flag for sync operations.
     * @author Robin DOUET
     * @param {boolean} flag - Whether to avoid detaching existing relations.
     * @returns {this}
     * @example
     * builder.setWithoutDetaching(true);
     */
    setWithoutDetaching(flag: boolean): this {
        if (this.relation.operation === 'sync') {
            (this.relation as any).without_detaching = flag;
        }
        return this;
    }

    /**
     * Adds a nested relation to this relation.
     * @author Robin DOUET
     * @param {string} relationName - The name of the nested relation.
     * @param {IMutateRelationRequest | IMutateRelationRequest[]} relation - Relation(s) to add.
     * @returns {this}
     * @example
     * builder.addRelation('permissions', MutateRelationBuilder.attach(2).build());
     */
    addRelation(relationName: string, relation: IMutateRelationRequest | IMutateRelationRequest[]): this {
        if (!this.relation.relations) this.relation.relations = {};
        this.relation.relations[relationName] = relation;
        return this;
    }

    /**
     * Finalizes and builds the relation object.
     * @author Robin DOUET
     * @returns {IMutateRelationRequest} A fully built relation object.
     * @example
     * const relation = builder.build();
     */
    build(): IMutateRelationRequest {
        return this.relation as IMutateRelationRequest;
    }
}


class MutateItemBuilder<T> {
    request: Partial<IMutateRequest<T>>;
    parent: MutateArrayBuilder<T>;

    /**
     * Initializes a mutation item (create or update).
     * @author Robin DOUET
     * @param {'create' | 'update'} operation - The type of mutation.
     * @param {MutateArrayBuilder<T>} parent - The parent array builder.
     * @param {number | string} [key] - Required if operation is `update`.
     * @param {T} [attributes] - The initial data for the item.
     */
    constructor(operation: 'create' | 'update', parent: MutateArrayBuilder<T>, key?: number | string, attributes?: T) {
        this.parent = parent;
        this.request = { operation };
        if (attributes !== undefined)
            (this.request as any).attributes = attributes;
        if (operation === 'update' && key !== undefined) {
            (this.request as any).key = key;
        }
    }

    /**
     * Adds a relation to this item.
     * @author Robin DOUET
     * @param {string} name - Name of the relation.
     * @param {IMutateRelationRequest | IMutateRelationRequest[]} relation - Relation(s) to associate.
     * @returns {this}
     * @example
     * item.addRelation('tags', MutateRelationBuilder.attach(2).build());
     */
    addRelation(name: string, relation: IMutateRelationRequest | IMutateRelationRequest[]): this {
        if (!this.request.relations) this.request.relations = {};
        this.request.relations[name] = relation;
        return this;
    }

    /**
     * Enables or disables the `without_detaching` flag (only for updates).
     * @author Robin DOUET
     * @param {boolean} flag - Whether to avoid detaching.
     * @returns {this}
     */
    setWithoutDetaching(flag: boolean): this {
        if (this.request.operation === 'update') {
            (this.request as any).without_detaching = flag;
        }
        return this;
    }

    /**
     * Ends the current item and returns to the array builder.
     * @author Robin DOUET
     * @returns {MutateArrayBuilder<T>}
     */
    end(): MutateArrayBuilder<T> {
        this.parent.push(this.request as IMutateRequest<T>);
        return this.parent;
    }

    /**
     * Finalizes and builds the item request.
     * @author Robin DOUET
     * @returns {IMutateRequest<T>}
     */
    build(): IMutateRequest<T> {
        return this.request as IMutateRequest<T>;
    }
}


class MutateArrayBuilder<T> {
    private requests: IMutateRequest<T>[] = [];

    /**
     * Adds a new item with a `create` operation.
     * @author Robin DOUET
     * @param {T} [attributes] - Initial attributes.
     * @returns {MutateItemBuilder<T>}
     * @example
     * builder.addCreate({ name: 'New Item' }).end();
     */
    addCreate(attributes?: any): MutateItemBuilder<T> {
        return new MutateItemBuilder('create', this, undefined, attributes);
    }

    /**
     * Adds a new item with an `update` operation.
     * @author Robin DOUET
     * @param {number | string} key - Identifier of the item to update.
     * @param {T} [attributes] - Updated attributes.
     * @returns {MutateItemBuilder<T>}
     * @example
     * builder.addUpdate(1, { name: 'Updated Name' }).end();
     */
    addUpdate(key: number | string, attributes?: any): MutateItemBuilder<T> {
        return new MutateItemBuilder('update', this, key, attributes);
    }

    /**
     * Pushes a completed mutation request into the array.
     * @author Robin DOUET
     * @param {IMutateRequest<T>} request - The request to add.
     */
    push(request: IMutateRequest<T>): void {
        this.requests.push(request);
    }

    /**
     * Finalizes and returns the array of mutation requests.
     * @author Robin DOUET
     * @returns {IMutateRequest<T>[]}
     * @example
     * const result = builder.build();
     * // JSON Output: [ {...}, {...} ]
     */
    build(): IMutateRequest<T>[] {
        return this.requests;
    }
}


export { MutateRelationBuilder, MutateArrayBuilder };


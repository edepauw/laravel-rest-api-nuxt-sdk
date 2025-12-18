import type {
    IAggregate, IFilter,
    IGate, IInclude,
    IInstruction, ISearchQuery,
    IScopes, ISelect,
    ISort, IText
} from "../types/search";

/**
 * A builder class to construct a complex search query for a given resource.
 * Supports chaining of filters, sorts, scopes, includes, and more.
 *
 * @template T The type of the resource being queried.
 */
export class SearchQueryBuilder<T> {
    private text: IText = { value: "" };
    private scopes: IScopes[] = [];
    private filters: IFilter<T>[] = [];
    private sorts: ISort[] = [];
    private selects: ISelect[] = [];
    private includes: IInclude<T>[] = [];
    private aggregates: IAggregate<T>[] = [];
    private instructions: IInstruction[] = [];
    private gates: IGate[] = [];
    private page: number = 0;
    private limit: number = 0;

    /**
     * Sets the text search options.
     *
     * @author Robin DOUET
     * @param {IText} text - Text filter containing the value and optional trash state.
     * @returns {this}
     *
     * @example
     * builder.setText({ value: 'john', trashed: 'with' });
     */
    setText(text: IText): this {
        this.text = text;
        return this;
    }

    /**
     * Sets the scopes to be applied on the search query.
     *
     * @author Robin DOUET
     * @param {IScopes[]} scopes - Array of scope objects.
     * @returns {this}
     *
     * @example
     * builder.setScopes([{ name: 'active' }]);
     */
    setScopes(scopes: IScopes[]): this {
        this.scopes = scopes;
        return this;
    }

    /**
     * Sets filters for the query.
     *
     * @author Robin DOUET
     * @param {IFilter<T>[]} filters - Array of filter conditions.
     * @returns {this}
     *
     * @example
     * builder.setFilters([{ field: 'status', operator: '=', value: 'published' }]);
     */
    setFilters(filters: IFilter<T>[]): this {
        this.filters = filters;
        return this;
    }

    /**
     * Sets sorting criteria.
     *
     * @author Robin DOUET
     * @param {ISort[]} sorts - Array of sort options.
     * @returns {this}
     *
     * @example
     * builder.setSorts([{ field: 'created_at', direction: 'desc' }]);
     */
    setSorts(sorts: ISort[]): this {
        this.sorts = sorts;
        return this;
    }

    /**
     * Sets the fields to select in the result.
     *
     * @author Robin DOUET
     * @param {ISelect[]} selects - Array of fields to return.
     * @returns {this}
     *
     * @example
     * builder.setSelects([{ field: 'id' }, { field: 'name' }]);
     */
    setSelects(selects: ISelect[]): this {
        this.selects = selects;
        return this;
    }

    /**
     * Sets the related entities to include in the result.
     *
     * @author Robin DOUET
     * @param {IInclude<T>[]} includes - Array of includes with their own filters/scopes/etc.
     * @returns {this}
     *
     * @example
     * builder.setIncludes([{ relation: 'tags', selects: [{ field: 'label' }] }]);
     */
    setIncludes(includes: IInclude<T>[]): this {
        this.includes = includes;
        return this;
    }

    /**
     * Sets aggregate functions to compute on related data.
     *
     * @author Robin DOUET
     * @param {IAggregate<T>[]} aggregates - Array of aggregate definitions.
     * @returns {this}
     *
     * @example
     * builder.setAggregates([{ relation: 'comments', type: 'count' }]);
     */
    setAggregates(aggregates: IAggregate<T>[]): this {
        this.aggregates = aggregates;
        return this;
    }

    /**
     * Sets custom instructions to modify backend behavior.
     *
     * @author Robin DOUET
     * @param {IInstruction[]} instructions - Array of instructions with optional fields.
     * @returns {this}
     *
     * @example
     * builder.setInstructions([{ name: 'with_permissions' }]);
     */
    setInstructions(instructions: IInstruction[]): this {
        this.instructions = instructions;
        return this;
    }

    /**
     * Sets access gates to control permissions.
     *
     * @author Robin DOUET
     * @param {IGate[]} gates - Gate definitions (usually from backend).
     * @returns {this}
     *
     * @example
     * builder.setGates([{ gates: ['admin'] }]);
     */
    setGates(gates: IGate[]): this {
        this.gates = gates;
        return this;
    }

    /**
     * Sets the page number for pagination.
     *
     * @author Robin DOUET
     * @param {number} page - The page number to request (starts at 1).
     * @returns {this}
     *
     * @example
     * builder.setPage(2);
     */
    setPage(page: number): this {
        this.page = page;
        return this;
    }

    /**
     * Sets the number of items to return per page.
     *
     * @author Robin DOUET
     * @param {number} limit - Maximum items per page.
     * @returns {this}
     *
     * @example
     * builder.setLimit(20);
     */
    setLimit(limit: number): this {
        this.limit = limit;
        return this;
    }

    /**
     * Builds and returns the final `ISearchQuery<T>` object to be sent to the backend.
     * Only populated fields are included in the result.
     *
     * @author Robin DOUET
     * @returns {ISearchQuery<T>} The constructed query object.
     *
     * @example
     * const query = builder
     *   .setText({ value: 'report' })
     *   .setFilters([{ field: 'status', operator: '=', value: 'open' }])
     *   .setSorts([{ field: 'created_at', direction: 'desc' }])
     *   .setPage(1)
     *   .setLimit(10)
     *   .build();
     *
     * // JSON Output:
     * {
     *   "text": { "value": "report" },
     *   "filters": [{ "field": "status", "operator": "=", "value": "open" }],
     *   "sorts": [{ "field": "created_at", "direction": "desc" }],
     *   "page": 1,
     *   "limit": 10
     * }
     */
    build(): ISearchQuery<T> {
        return {
            ...(this.text.value ? { text: this.text } : {}),
            ...(this.scopes.length > 0 ? { scopes: this.scopes } : {}),
            ...(this.filters.length > 0 ? { filters: this.filters } : {}),
            ...(this.sorts.length > 0 ? { sorts: this.sorts } : {}),
            ...(this.selects.length > 0 ? { selects: this.selects } : {}),
            ...(this.includes.length > 0 ? { includes: this.includes } : {}),
            ...(this.aggregates.length > 0 ? { aggregates: this.aggregates } : {}),
            ...(this.instructions.length > 0 ? { instructions: this.instructions } : {}),
            ...(this.gates.length > 0 ? { gates: this.gates } : {}),
            ...(this.page > 0 ? { page: this.page } : {}),
            ...(this.limit > 0 ? { limit: this.limit } : {}),
        };
    }
}

import type {
    IAggregate, IFilter, IGate,
    IInclude, IInstruction, IScopes,
    ISelect, ISort, IText
} from "../../types/search";

/**
 * Builder class to construct include relations for search queries.
 * Includes allow loading related entities with their own query parameters.
 *
 * @template T The type of the main resource.
 *
 * @author Robin DOUET
 */
export class IncludeBuilder<T> {
    private includes: IInclude<T>[] = [];

    /**
     * Adds an include relation with optional nested query parameters.
     *
     * @author Robin DOUET
     * @description Adds an include relation, specifying the related entity and optional query
     * constraints such as filters, sorts, selects, nested includes, aggregates, etc.
     *
     * @param {Object} params - The include parameters.
     * @param {string} params.relation - The name of the relation to include.
     * @param {IText} [params.text] - Optional text search parameters for the relation.
     * @param {IScopes[]} [params.scopes] - Optional scopes to apply to the relation query.
     * @param {IFilter<T>[]} [params.filters] - Optional filters on the related entity.
     * @param {ISort[]} [params.sorts] - Optional sorting options.
     * @param {ISelect[]} [params.selects] - Optional select fields.
     * @param {IInclude<T>[]} [params.includes] - Nested includes within this relation.
     * @param {IAggregate<T>[]} [params.aggregates] - Optional aggregates on the relation.
     * @param {IInstruction[]} [params.instructions] - Optional instructions.
     * @param {IGate[]} [params.gates] - Optional gates for complex filter logic.
     * @param {number} [params.page] - Pagination page number for the relation.
     * @param {number} [params.limit] - Pagination limit for the relation.
     *
     * @returns {this} The builder instance for chaining.
     *
     * @example
     * const builder = new IncludeBuilder<User>()
     *   .addInclude({
     *     relation: 'posts',
     *     filters: [{ field: 'published', operator: '=', value: true }],
     *     sorts: [{ field: 'created_at', direction: 'desc' }],
     *     page: 1,
     *     limit: 10
     *   });
     *
     * const includes = builder.build();
     *
     * // JSON output:
     * [
     *   {
     *     relation: 'posts',
     *     filters: [{ field: 'published', operator: '=', value: true }],
     *     sorts: [{ field: 'created_at', direction: 'desc' }],
     *     page: 1,
     *     limit: 10
     *   }
     * ]
     */
    addInclude({
        relation, text, scopes,
        filters, sorts, selects,
        includes, aggregates, instructions,
        gates, page, limit
    }: {
        relation: string,
        text?: IText,
        scopes?: IScopes[],
        filters?: IFilter<T>[],
        sorts?: ISort[],
        selects?: ISelect[],
        includes?: IInclude<T>[],
        aggregates?: IAggregate<T>[],
        instructions?: IInstruction[],
        gates?: IGate[],
        page?: number,
        limit?: number
    }): this {
        this.includes.push({
            relation, ...(text && {text}), ...(scopes && {scopes}),
            ...(filters && {filters}), ...(sorts && {sorts}), ...(selects && {selects}),
            ...(includes && {includes}), ...(aggregates && {aggregates}), ...(instructions && {instructions}),
            ...(gates && {gates}), ...(page && {page}), ...(limit && {limit})
        });
        return this;
    }

    /**
     * Builds and returns the array of include relations.
     *
     * @author Robin DOUET
     * @returns {IInclude<T>[]} The array of include relations configured.
     *
     * @example
     * const includes = builder.build();
     */
    build(): IInclude<T>[] {
        return this.includes;
    }
}
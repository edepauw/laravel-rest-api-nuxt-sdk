import type { IAggregate, IFilter } from "../../types/search";

/**
 * A builder class to construct aggregation instructions for search queries.
 * Allows defining aggregates (like count, sum, avg...) on related entities.
 *
 * @template T The type of the base resource.
 */
export class AggregateBuilder<T> {
    private aggregate: IAggregate<T>[] = [];

    /**
     * Adds a new aggregation to the builder.
     *
     * @author Robin DOUET
     * @description Defines an aggregation on a related resource, optionally with a field and filters.
     *
     * @param {Object} params - Parameters for the aggregation.
     * @param {string} params.relation - The name of the relation on which to apply the aggregation.
     * @param {string} params.type - The aggregation type (e.g., 'count', 'sum', 'avg').
     * @param {string} [params.field] - The field on which to apply the aggregation (optional for some types like 'count').
     * @param {IFilter<T>[]} [params.filters] - Optional filters to apply before aggregating.
     *
     * @returns {this} The current builder instance for chaining.
     *
     * @example
     * const builder = new AggregateBuilder<User>()
     *   .addAggregates({
     *     relation: 'orders',
     *     type: 'sum',
     *     field: 'total',
     *     filters: [{ field: 'status', operator: '=', value: 'completed' }]
     *   });
     *
     * const aggregates = builder.build();
     *
     * // JSON Output:
     * [
     *   {
     *     relation: 'orders',
     *     type: 'sum',
     *     field: 'total',
     *     filters: [
     *       { field: 'status', operator: '=', value: 'completed' }
     *     ]
     *   }
     * ]
     */
    addAggregates({
      relation,
      type,
      field,
      filters
    }: {
        relation: string;
        type: string;
        field?: string;
        filters?: IFilter<T>[];
    }): this {
        this.aggregate.push({ relation, type, ...(field && {field}), ...(filters && {filters}) });
        return this;
    }

    /**
     * Finalizes and returns the array of aggregate instructions.
     *
     * @author Robin DOUET
     * @returns {IAggregate<T>[]} An array of aggregation definitions.
     *
     * @example
     * const result = builder.build();
     */
    build(): IAggregate<T>[] {
        return this.aggregate;
    }
}
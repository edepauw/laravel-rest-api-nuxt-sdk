import type { IFilter, operatorType } from "../../types/search";

/**
 * A builder class to construct filter conditions for search queries.
 * Supports both flat and nested filter logic (AND/OR).
 *
 * @template T The type of the resource to filter.
 */
export class FilterBuilder<T> {
    private filters: IFilter<T>[] = [];
    private nestedFilters: IFilter<T>[] = [];

    /**
     * Adds a simple filter to the query.
     *
     * @author Robin DOUET
     * @description Adds a new flat filter to the filter list.
     *
     * @param {string} field - The name of the field to filter on.
     * @param {any} value - The value to compare the field against.
     * @param {operatorType} [operator] - The comparison operator (e.g. '=', '!=', 'in', 'like').
     * @param {"and" | "or"} [type] - Logical operator to apply if combined with other filters (default: 'and').
     *
     * @returns {this} The current builder instance (for chaining).
     *
     * @example
     * const builder = new FilterBuilder<User>()
     *   .addFilter('status', 'active', '=', 'and');
     *
     * // Result from builder.build():
     * [
     *   {
     *     field: 'status',
     *     value: 'active',
     *     operator: '=',
     *     type: 'and'
     *   }
     * ]
     */
    addFilter(
        field: string,
        value: any,
        operator?: operatorType,
        type?: "and" | "or"
    ): this {
        this.filters.push({ field, value, ...(operator && {operator}), ...(type && {type}) });
        return this;
    }

    /**
     * Adds a nested group of filters to the query.
     *
     * @author Robin DOUET
     * @description Adds a group of filters to be treated as a nested condition (e.g. `(A OR B)`).
     *
     * @param {IFilter<T>[]} nested - An array of filters to group together as a nested block.
     *
     * @returns {this} The current builder instance (for chaining).
     *
     * @example
     * const builder = new FilterBuilder<User>()
     *   .addNestedFilter([
     *     { field: 'status', operator: '=', value: 'pending', type: 'or' },
     *     { field: 'priority', operator: '>=', value: 2, type: 'or' }
     *   ]);
     *
     * // Result from builder.build():
     * [
     *   {
     *     nested: [
     *       { field: 'status', operator: '=', value: 'pending', type: 'or' },
     *       { field: 'priority', operator: '>=', value: 2, type: 'or' }
     *     ]
     *   }
     * ]
     */
    addNestedFilter(nested: IFilter<T>[]): this {
        this.nestedFilters.push({ nested });
        return this;
    }

    /**
     * Builds and returns the combined list of filters and nested filters.
     *
     * @author Robin DOUET
     * @returns {IFilter<T>[]} An array of all defined filters and nested filter groups.
     *
     * @example
     * const builder = new FilterBuilder<User>()
     *   .addFilter('status', 'active')
     *   .addNestedFilter([
     *     { field: 'role', operator: '=', value: 'admin' }
     *   ]);
     *
     * const filters = builder.build();
     *
     * // Result:
     * [
     *   { field: 'status', value: 'active', operator: '=', type: undefined },
     *   { nested: [ { field: 'role', operator: '=', value: 'admin' } ] }
     * ]
     */
    build(): IFilter<T>[] {
        return [...this.filters, ...this.nestedFilters];
    }
}
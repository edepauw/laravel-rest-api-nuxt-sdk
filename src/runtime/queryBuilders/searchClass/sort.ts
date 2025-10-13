import type { ISort } from "../../types/search";

/**
 * Builder class to construct sort criteria for search queries.
 * Sorts define the order in which the query results are returned.
 *
 * @author Robin DOUET
 */
export class SortBuilder {
    private sorts: ISort[] = [];

    /**
     * Adds a sort condition specifying a field and its direction.
     *
     * @author Robin DOUET
     * @description Adds a sorting rule to order results by a given field in ascending or descending order.
     *
     * @param {string} field - The field name to sort by.
     * @param {"asc" | "desc"} direction - The direction of the sort, either "asc" or "desc".
     *
     * @returns {this} The builder instance for chaining.
     *
     * @example
     * const builder = new SortBuilder()
     *   .addSort({ field: 'createdAt', direction: 'desc' });
     *
     * const sorts = builder.build();
     *
     * // JSON output:
     * [
     *   { field: 'createdAt', direction: 'desc' }
     * ]
     */
    addSort(field: string, direction?: "asc" | "desc"): this {
        this.sorts.push({ field, ...(direction && {direction}) });
        return this;
    }

    /**
     * Builds and returns the array of sort criteria.
     *
     * @author Robin DOUET
     * @returns {ISort[]} The array of sort rules configured.
     *
     * @example
     * const sorts = builder.build();
     */
    build(): ISort[] {
        return this.sorts;
    }
}
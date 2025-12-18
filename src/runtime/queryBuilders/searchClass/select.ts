import type { ISelect } from "../../types/search";

/**
 * Builder class to construct select fields for search queries.
 * Selects specify which fields should be returned in the query result.
 *
 * @author Robin DOUET
 */
export class SelectBuilder {
    private selects: ISelect[] = [];

    /**
     * Adds a field to be selected in the query results.
     *
     * @author Robin DOUET
     * @description Adds a field name to the list of fields to be selected.
     *
     * @param {string} field - The name of the field to select.
     *
     * @returns {this} The builder instance for chaining.
     *
     * @example
     * const builder = new SelectBuilder()
     *   .addSelect('name')
     *   .addSelect('email');
     *
     * const selects = builder.build();
     *
     * // JSON output:
     * [
     *   { field: 'name' },
     *   { field: 'email' }
     * ]
     */
    addSelect(field: string): this {
        this.selects.push({ field });
        return this;
    }

    /**
     * Builds and returns the array of selected fields.
     *
     * @author Robin DOUET
     * @returns {ISelect[]} The array of selected fields.
     *
     * @example
     * const selects = builder.build();
     */
    build(): ISelect[] {
        return this.selects;
    }
}
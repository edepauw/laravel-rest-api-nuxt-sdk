import type { IGate } from "../../types/search";

/**
 * A builder class to construct gate conditions for search queries.
 * Gates are used to combine multiple conditions or filters logically.
 *
 * @author Robin DOUET
 */
export class IGateBuilder {
    private gates: IGate[] = [];

    /**
     * Adds a new gate condition.
     *
     * @author Robin DOUET
     * @description Adds gate(s) which are logical containers for filters or other conditions.
     *
     * @param {any} gates - The gate(s) to add. Usually an array or object representing conditions.
     *
     * @returns {this} The builder instance for chaining.
     *
     * @example
     * const builder = new IGateBuilder()
     *   .addGate([
     *     { field: 'status', operator: '=', value: 'active' },
     *     { field: 'role', operator: '!=', value: 'guest' }
     *   ]);
     *
     * const gates = builder.build();
     *
     * // JSON Output:
     * [
     *   { gates: [
     *       { field: 'status', operator: '=', value: 'active' },
     *       { field: 'role', operator: '!=', value: 'guest' }
     *     ]
     *   }
     * ]
     */
    addGate(gates: any): this {
        this.gates.push({ gates });
        return this;
    }

    /**
     * Builds and returns the array of gate conditions.
     *
     * @author Robin DOUET
     * @returns {IGate[]} An array of gate objects.
     *
     * @example
     * const result = builder.build();
     */
    build(): IGate[] {
        return this.gates;
    }
}
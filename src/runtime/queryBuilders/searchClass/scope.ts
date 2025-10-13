import type { IScopes } from "../../types/search";

/**
 * Builder class to construct scopes for search queries.
 * Scopes are predefined query modifiers that can be applied with optional parameters.
 *
 * @author Robin DOUET
 */
export class ScopeBuilder {
    private scopes: IScopes[] = [];

    /**
     * Adds a new scope with a name and optional parameters.
     *
     * @author Robin DOUET
     * @description Adds a scope to the list of scopes to be applied to the search query.
     *
     * @param {string} name - The name of the scope.
     * @param {any[]} [parameters] - Optional parameters for the scope.
     *
     * @returns {this} The builder instance for chaining.
     *
     * @example
     * const builder = new ScopeBuilder()
     *   .addScope({ name: 'activeUsers', parameters: [true] });
     *
     * const scopes = builder.build();
     *
     * // JSON output:
     * [
     *   { name: 'activeUsers', parameters: [true] }
     * ]
     */
    addScope(name: string, parameters?: any[]): this {
        this.scopes.push({ name, ...(parameters && {parameters}) });
        return this;
    }

    /**
     * Builds and returns the array of scopes.
     *
     * @author Robin DOUET
     * @returns {IScopes[]} The array of scopes configured.
     *
     * @example
     * const scopes = builder.build();
     */
    build(): IScopes[] {
        return this.scopes;
    }
}
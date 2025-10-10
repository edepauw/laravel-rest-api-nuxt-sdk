import type {
    IAggregate, IFilter,
    IGate, IInclude,
    IInstruction, ISearchQuery,
    IScopes, ISelect,
    ISort, IText
} from "../types/search";

export class SearchQueryBuilder<T> {
    private text: IText = {value: ""};
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


    setText(text: IText): this {
        this.text = text;
        return this;
    }

    setScopes(scopes: IScopes[]): this {
        this.scopes = scopes;
        return this;
    }

    setFilters(filters: IFilter<T>[]): this {
        this.filters = filters;
        return this;
    }

    setSorts(sorts: ISort[]): this {
        this.sorts = sorts;
        return this;
    }

    setSelects(selects: ISelect[]): this {
        this.selects = selects;
        return this;
    }

    setIncludes(includes: IInclude<T>[]): this {
        this.includes = includes;
        return this;
    }

    setAggregates(aggregates: IAggregate<T>[]): this {
        this.aggregates = aggregates;
        return this;
    }

    setInstructions(instructions: IInstruction[]): this {
        this.instructions = instructions;
        return this;
    }

    setGates(gates: IGate[]): this {
        this.gates = gates;
        return this;
    }

    setPage(page: number): this {
        this.page = page;
        return this;
    }

    setLimit(limit: number): this {
        this.limit = limit;
        return this;
    }

    build(): ISearchQuery<T> {
        return {
            ...(this.text.value ? {text: this.text} : {}),
            ...(this.scopes.length > 0 ? {scopes: this.scopes} : {}),
            ...(this.filters.length > 0 ? {filters: this.filters} : {}),
            ...(this.sorts.length > 0 ? {sorts: this.sorts} : {}),
            ...(this.selects.length > 0 ? {selects: this.selects} : {}),
            ...(this.includes.length > 0 ? {includes: this.includes} : {}),
            ...(this.aggregates.length > 0 ? {aggregates: this.aggregates} : {}),
            ...(this.instructions.length > 0 ? {instructions: this.instructions} : {}),
            ...(this.gates.length > 0 ? {gates: this.gates} : {}),
            ...(this.page > 0 ? {page: this.page} : {}),
            ...(this.limit > 0 ? {limit: this.limit} : {}),
        };
    }
}
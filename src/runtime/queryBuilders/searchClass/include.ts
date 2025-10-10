import type {
    IAggregate, IFilter, IGate,
    IInclude, IInstruction, IScopes,
    ISelect, ISort, IText
} from "../../types/search";

export class IncludeBuilder<T> {
    private includes: IInclude<T>[] = [];

    addInclude(
        {
            relation, text, scopes,
            filters, sorts, selects,
            includes, aggregates, instructions,
            gates, page, limit
        }: {
            relation: string, text?: IText, scopes?: IScopes[],
            filters?: IFilter<T>[], sorts?: ISort[], selects?: ISelect[],
            includes?: IInclude<T>[], aggregates?: IAggregate<T>[], instructions?: IInstruction[],
            gates?: IGate[], page?: number, limit?: number
        }): this {
        this.includes.push({
            relation, text, scopes,
            filters, sorts, selects,
            includes, aggregates, instructions,
            gates, page, limit
        });
        return this;
    }

    build(): IInclude<T>[] {
        return this.includes;
    }
}
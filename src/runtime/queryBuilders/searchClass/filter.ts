import type {IFilter, operatorType} from "../../types/search";

export class FilterBuilder<T> {
    private filters: IFilter<T>[] = [];
    private nestedFilters: IFilter<T>[] = [];

    addFilter(
        {
            field, value, operator,
            type, nested
        }
        : {
            field?: string; value?: any;
            operator?: operatorType;
            type?: "and" | "or"; nested?: IFilter<T>[];
        }): this {
        this.filters.push({field, value, operator, type, nested});
        return this;
    }

    addNestedFilter(
        {
            field,
            value,
            operator,
            type,
            nested
        }
        : {
            field?: string;
            value?: any;
            operator?: operatorType;
            type?: "and" | "or";
            nested?: IFilter<T>[];
        }): this {
        this.nestedFilters.push({field, value, operator, type, nested});
        return this;
    }

    build(): IFilter<T>[] {
        return [...this.filters, ...this.nestedFilters];
    }
}
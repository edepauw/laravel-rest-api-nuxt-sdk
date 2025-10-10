import type {IAggregate, IFilter} from "../../types/search";

export class AggregateBuilder<T> {
    private aggregate: IAggregate<T>[] = [];

    addAggregates(
        {
            relation, type,
            field, filters
        }
        : {
            relation: string; type: string;
            field?: string; filters?: IFilter<T>[];
        }): this {
        this.aggregate.push({relation, type, field, filters});
        return this;
    }

    build(): IAggregate<T>[] {
        return this.aggregate;
    }
}
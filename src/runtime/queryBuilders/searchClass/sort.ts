import type { ISort } from "../../types/search";

export class SortBuilder {
    private sorts: ISort[] = [];

    addSort(
        { field, direction }
        : { field: string; direction: "asc" | "desc"; }): this {
        this.sorts.push({field, direction});
        return this;
    }

    build(): ISort[] {
        return this.sorts;
    }
}
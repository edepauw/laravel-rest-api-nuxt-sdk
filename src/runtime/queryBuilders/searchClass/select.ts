import type { ISelect } from "../../types/search";

export class SelectBuilder {
    private selects: ISelect[] = [];

    addSelect(field: string): this {
        this.selects.push({field});
        return this;
    }

    build(): ISelect[] {
        return this.selects;
    }
}
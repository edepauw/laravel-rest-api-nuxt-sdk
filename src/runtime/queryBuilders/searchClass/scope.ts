import type { IScopes } from "../../types/search";
export class ScopeBuilder {
    private scopes: IScopes[] = [];

    addScope(
        { name, parameters }
        : { name: string; parameters?: any[] }): this {
        this.scopes.push({name, parameters});
        return this;
    }

    build(): IScopes[] {
        return this.scopes;
    }
}
import type { IGate } from "../../types/search";

export class IGateBuilder {
    private gates: IGate[] = [];

    addGate(gates: any): this {
        this.gates.push({gates});
        return this;
    }

    build(): IGate[] {
        return this.gates;
    }
}
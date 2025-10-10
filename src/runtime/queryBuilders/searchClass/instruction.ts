import type { IInstruction } from "../../types/search";

export class IInstructionBuilder {
    private instructions: IInstruction[] = [];

    addInstruction(
        {
            name, fields
        }
        : {
            name: string; fields?: any[];
        }): this {
        this.instructions.push({name, fields});
        return this;
    }

    build(): IInstruction[] {
        return this.instructions;
    }
}
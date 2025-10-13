import type { IInstruction } from "../../types/search";

/**
 * Builder class to construct instructions for search queries.
 * Instructions represent additional commands or options to modify query behavior.
 *
 * @author Robin DOUET
 */
export class IInstructionBuilder {
    private instructions: IInstruction[] = [];

    /**
     * Adds an instruction with a name and optional fields.
     *
     * @author Robin DOUET
     * @description Adds a new instruction to the list of instructions.
     *
     * @param {string} name - The name of the instruction.
     * @param {any[]} [fields] - Optional fields associated with the instruction.
     *
     * @returns {this} The builder instance for chaining.
     *
     * @example
     * const builder = new IInstructionBuilder()
     *   .addInstruction({ name: 'calculate', fields: ['sum', 'average'] });
     *
     * const instructions = builder.build();
     *
     * // JSON output:
     * [
     *   { name: 'calculate', fields: ['sum', 'average'] }
     * ]
     */
    addInstruction(name: string, fields?: any[]): this {
        this.instructions.push({ name, ...(fields && {fields}) });
        return this;
    }

    /**
     * Builds and returns the array of instructions.
     *
     * @author Robin DOUET
     * @returns {IInstruction[]} The array of instructions configured.
     *
     * @example
     * const instructions = builder.build();
     */
    build(): IInstruction[] {
        return this.instructions;
    }
}
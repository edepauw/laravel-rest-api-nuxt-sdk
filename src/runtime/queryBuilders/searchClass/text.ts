import type { IText } from "../../types/search";

/**
 * Builder class to construct a text search query part.
 * Text represents the main search string with an optional trashed filter.
 *
 * @author Robin DOUET
 */
export class TextBuilder {
    private text: IText = { value: "" };

    /**
     * Sets the main text value and optional trashed filter for the search.
     *
     * @author Robin DOUET
     * @description Sets the search text and optionally filters trashed items.
     *
     * @param {string} field - The main text to search for.
     * @param {"with" | "only" | "omitted"} [trashed] - Optional trashed filter:
     * "with" includes trashed items, "only" includes only trashed items,
     * "omitted" excludes trashed items.
     *
     * @returns {this} The builder instance for chaining.
     *
     * @example
     * const builder = new TextBuilder()
     *   .addText('search term', 'with');
     *
     * const text = builder.build();
     *
     * // JSON output:
     * {
     *   value: 'search term',
     *   trashed: 'with'
     * }
     */
    addText(field: string, trashed?: "with" | "only" | "omitted"): this {
        this.text.value = field;
        if (trashed)
            this.text.trashed = trashed;
        return this;
    }

    /**
     * Builds and returns the text object.
     *
     * @author Robin DOUET
     * @returns {IText} The constructed text search object.
     *
     * @example
     * const text = builder.build();
     */
    build(): IText {
        return this.text;
    }
}
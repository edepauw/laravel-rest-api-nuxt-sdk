import type { IText } from "../../types/search";

export class TextBuilder {
    private text: IText = {value: ""};

    addText(field: string, trashed?: "with"|"only"|"omitted"): this {
        this.text.value = field;
        if(trashed)
            this.text.trashed = trashed
        return this;
    }

    build(): IText {
        return this.text;
    }
}
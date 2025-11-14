import { createBuilder } from "@coltorapps/builder";
import { textFieldEntity } from "./entities/text-field";
import { textareaFieldEntity } from "./entities/textarea-field";
import { selectFieldEntity } from "./entities/select-field";
import { fileFieldEntity } from "./entities/file-field";
import { gridLayoutEntity } from "./entities/grid-layout";

export const demoCenterFormBuilder = createBuilder({
  entities: [
    textFieldEntity,
    textareaFieldEntity,
    selectFieldEntity,
    fileFieldEntity,
    gridLayoutEntity,
  ],
});

export type DemoCenterFormBuilder = typeof demoCenterFormBuilder;

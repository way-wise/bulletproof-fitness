import { createBuilder } from "@coltorapps/builder";
import { textFieldEntity } from "./entities/text-field";
import { textareaFieldEntity } from "./entities/textarea-field";
import { selectFieldEntity } from "./entities/select-field";
import { fileFieldEntity } from "./entities/file-field";
import { gridLayoutEntity } from "./entities/grid-layout";
import { locationFieldEntity } from "./entities/location-field";
import { checkboxFieldEntity } from "./entities/checkbox-field";
import { checkboxGroupFieldEntity } from "./entities/checkbox-group-field";

export const demoCenterFormBuilder = createBuilder({
  entities: [
    textFieldEntity,
    textareaFieldEntity,
    selectFieldEntity,
    checkboxFieldEntity,
    checkboxGroupFieldEntity,
    fileFieldEntity,
    gridLayoutEntity,
    locationFieldEntity,
  ],
});

export type DemoCenterFormBuilder = typeof demoCenterFormBuilder;

import { z } from "zod";
import { createEntity } from "@coltorapps/builder";
import { labelAttribute } from "../attributes/label";
import { placeholderAttribute } from "../attributes/placeholder";
import { requiredAttribute } from "../attributes/required";
import { optionsAttribute } from "../attributes/options";

export const selectFieldEntity = createEntity({
  name: "selectField",
  attributes: [
    labelAttribute,
    placeholderAttribute,
    requiredAttribute,
    optionsAttribute,
  ],
  validate(value) {
    return z.string().optional().parse(value);
  },
});

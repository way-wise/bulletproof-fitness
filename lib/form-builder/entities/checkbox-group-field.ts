import { z } from "zod";
import { createEntity } from "@coltorapps/builder";
import { labelAttribute } from "../attributes/label";
import { requiredAttribute } from "../attributes/required";
import { optionsAttribute } from "../attributes/options";

export const checkboxGroupFieldEntity = createEntity({
  name: "checkboxGroupField",
  attributes: [labelAttribute, requiredAttribute, optionsAttribute],
  validate(value) {
    return z.array(z.string()).optional().parse(value);
  },
});

import { z } from "zod";
import { createEntity } from "@coltorapps/builder";
import { labelAttribute } from "../attributes/label";
import { requiredAttribute } from "../attributes/required";

export const checkboxFieldEntity = createEntity({
  name: "checkboxField",
  attributes: [labelAttribute, requiredAttribute],
  validate(value) {
    return z.boolean().optional().parse(value);
  },
});

import { z } from "zod";
import { createEntity } from "@coltorapps/builder";
import { labelAttribute } from "../attributes/label";
import { placeholderAttribute } from "../attributes/placeholder";
import { requiredAttribute } from "../attributes/required";

export const textFieldEntity = createEntity({
  name: "textField",
  attributes: [labelAttribute, placeholderAttribute, requiredAttribute],
  validate(value) {
    return z.string().optional().parse(value);
  },
});

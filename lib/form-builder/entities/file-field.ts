import { z } from "zod";
import { createEntity } from "@coltorapps/builder";
import { labelAttribute } from "../attributes/label";
import { placeholderAttribute } from "../attributes/placeholder";
import { requiredAttribute } from "../attributes/required";

export const fileFieldEntity = createEntity({
  name: "fileField",
  attributes: [labelAttribute, placeholderAttribute, requiredAttribute],
  validate(value) {
    return z.string().url().optional().parse(value);
  },
});

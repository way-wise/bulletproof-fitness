import { z } from "zod";
import { createEntity } from "@coltorapps/builder";
import { columnsAttribute } from "../attributes/columns";
import { gapAttribute } from "../attributes/gap";

export const gridLayoutEntity = createEntity({
  name: "gridLayout",
  attributes: [columnsAttribute, gapAttribute],
  validate(value) {
    return z
      .object({
        children: z.array(z.any()).optional(),
      })
      .optional()
      .parse(value);
  },
});

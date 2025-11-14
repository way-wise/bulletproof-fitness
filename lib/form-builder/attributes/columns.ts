import { z } from "zod";
import { createAttribute } from "@coltorapps/builder";

export const columnsAttribute = createAttribute({
  name: "columns",
  validate(value) {
    return z.enum(["1", "2", "3"]).parse(value);
  },
});

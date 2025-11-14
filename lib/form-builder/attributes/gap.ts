import { z } from "zod";
import { createAttribute } from "@coltorapps/builder";

export const gapAttribute = createAttribute({
  name: "gap",
  validate(value) {
    return z.enum(["sm", "md", "lg"]).parse(value);
  },
});

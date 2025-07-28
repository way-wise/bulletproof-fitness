import { isValid } from "ulid";
import { object, string } from "yup";

export const idSchema = object({
  id: string()
    .required("id is required")
    .test("id", "Invalid id", (value) => isValid(value)),
});

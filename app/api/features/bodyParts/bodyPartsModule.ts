import { bodyPartSchema } from "@/schema/bodyparts";
import { paginationQuerySchema } from "@/schema/paginationSchema";
import { Hono, type Context } from "hono";
import { object, string } from "yup";
import { validateInput } from "../../lib/validateInput";
import { bodyPartsService } from "./bodyPartsService";

export const bodyPartsModule = new Hono();

/*
  @route    GET: /body-parts
  @access   private
  @desc     Get all body parts (Paginated)
*/
bodyPartsModule.get("/", async (c: Context) => {
  const validatedQuery = await validateInput({
    type: "query",
    schema: paginationQuerySchema,
    data: c.req.query(),
  });

  const result = await bodyPartsService.getBodyParts(validatedQuery);

  return c.json(result);
});

/*
  @route    GET: /body-parts
  @access   private
  @desc     Get all body parts (Non-paginated)
*/
bodyPartsModule.get("/all", async (c: Context) => {
  const result = await bodyPartsService.getAllBodyParts();

  return c.json(result);
});

/*
  @route    POST: /equipments
  @access   private
  @desc     Create new equipment
*/
bodyPartsModule.post("/", async (c: Context) => {
  const validatedBody = await validateInput({
    type: "form",
    schema: bodyPartSchema,
    data: await c.req.json(),
  });

  const result = await bodyPartsService.createBodyPart(validatedBody);
  return c.json(result);
});

/*
  @route    GET: /equipments/:id
  @access   private
  @desc     Get equipment by id
*/
bodyPartsModule.get("/:id", async (c: Context) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const result = await bodyPartsService.getBodyPart(validatedParam.id);
  return c.json(result);
});

bodyPartsModule.put("/:id", async (c) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const validatedBody = await validateInput({
    type: "form",
    schema: bodyPartSchema,
    data: await c.req.json(),
  });

  const result = await bodyPartsService.updateBodyPart(
    validatedParam.id,
    validatedBody,
  );
  return c.json(result);
});

/*
  @route    DELETE: /equipments/:id
  @access   private
  @desc     Delete equipment by id
*/
bodyPartsModule.delete("/:id", async (c: Context) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const result = await bodyPartsService.deleteBodyPart(validatedParam.id);
  return c.json(result);
});

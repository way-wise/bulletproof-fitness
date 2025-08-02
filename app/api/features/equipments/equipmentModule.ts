import { equipmentSchema } from "@/schema/equipment";
import { paginationQuerySchema } from "@/schema/paginationSchema";
import { Hono } from "hono";
import { object, string } from "yup";
import { validateInput } from "../../lib/validateInput";
import { equipmentService } from "./equipmentService";

export const equipmentModule = new Hono();

/*
  @route    GET: /equipments
  @access   private
  @desc     Get all equipments
*/
equipmentModule.get("/", async (c) => {
  const validatedQuery = await validateInput({
    type: "query",
    schema: paginationQuerySchema,
    data: c.req.query(),
  });

  const result = await equipmentService.getEquipments(validatedQuery);

  return c.json(result);
});

/*
  @route    POST: /equipments
  @access   private
  @desc     Create new equipment
*/
equipmentModule.post("/", async (c) => {
  const validatedBody = await validateInput({
    type: "form",
    schema: equipmentSchema,
    data: await c.req.json(),
  });

  const result = await equipmentService.createEquipment(validatedBody);
  return c.json(result);
});

/*
  @route    GET: /equipments/:id
  @access   private
  @desc     Get equipment by id
*/
equipmentModule.get("/:id", async (c) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const result = await equipmentService.getEquipment(validatedParam.id);
  return c.json(result);
});

/*
  @route    DELETE: /equipments/:id
  @access   private
  @desc     Delete equipment by id
*/
equipmentModule.delete("/:id", async (c) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const result = await equipmentService.deleteEquipment(validatedParam.id);
  return c.json(result);
});

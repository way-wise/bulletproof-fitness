import { paginationQuerySchema } from "@/schema/paginationSchema";
import { rackSchema } from "@/schema/rackSchema";
import { Hono } from "hono";
import { object, string } from "yup";
import { validateInput } from "../../lib/validateInput";
import { racksService } from "./rackService";

export const racksModule = new Hono();

/*
  @route    GET: /racks
  @access   private
  @desc     Get all racks
*/
racksModule.get("/", async (c) => {
  const validatedQuery = await validateInput({
    type: "query",
    schema: paginationQuerySchema && object({
      search: string().optional(),
      sortBy: string().optional(),
      sortOrder: string().optional(),
    }),
    data: c.req.query(),
  });

  const result = await racksService.getRacks(validatedQuery);

  return c.json(result);
});

/*
  @route    GET: /racks/all
  @access   private
  @desc     Get all racks (Non-paginated)
*/
racksModule.get("/all", async (c) => {
  const result = await racksService.getAllRacks();

  return c.json(result);
});

/*
  @route    POST: /racks
  @access   private
  @desc     Create new rack
*/
racksModule.post("/", async (c) => {
  const validatedBody = await validateInput({
    type: "form",
    schema: rackSchema,
    data: await c.req.json(),
  });

  const result = await racksService.createRack(validatedBody);
  return c.json(result);
});

/*
  @route    GET: /racks/:id
  @access   private
  @desc     Get rack by id
*/
racksModule.get("/:id", async (c) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const result = await racksService.getRack(validatedParam.id);
  return c.json(result);
});

/*
  @route    PUT: /racks/:id
  @access   private
  @desc     Update rack by id
*/
racksModule.put("/:id", async (c) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const validatedBody = await validateInput({
    type: "form",
    schema: rackSchema,
    data: await c.req.json(),
  });

  const result = await racksService.updateRack(
    validatedParam.id,
    validatedBody,
  );
  return c.json(result);
});

/*
  @route    DELETE: /racks/:id
  @access   private
  @desc     Delete rack by id
*/
racksModule.delete("/:id", async (c) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const result = await racksService.deleteRack(validatedParam.id);
  return c.json(result);
});

import {
  blockDemoCenterSchema,
  demoCenterSchema,
  demoCenterQuerySchema,
  unblockDemoCenterSchema,
  updateDemoCenterStatusSchema,
} from "@/schema/demoCenters";
import { paginationQuerySchema } from "@/schema/paginationSchema";
import { Hono } from "hono";
import { object, string } from "yup";
import { validateInput } from "../../lib/validateInput";
import { demoCentersService } from "./demoCentersService";

export const demoCenterModule = new Hono();
/*
  @route    GET: /demo-centers
  @access   private
  @desc     Get all demo centers
*/
demoCenterModule.get("/", async (c) => {
  const validatedQuery = await validateInput({
    type: "query",
    schema: demoCenterQuerySchema,
    data: c.req.query(),
  });
  const result = await demoCentersService.getDemoCenters(validatedQuery);
  return c.json(result);
});

demoCenterModule.get("/dashboard", async (c) => {
  const query = c.req.query();

  const validatedQuery = await validateInput({
    type: "query",
    schema: paginationQuerySchema,
    data: query,
  });

  // Add search parameter if present
  const searchQuery = query.search
    ? { ...validatedQuery, search: query.search }
    : validatedQuery;

  const result = await demoCentersService.getDemoCentersDashboard(searchQuery);

  return c.json(result);
});

/*
        @route    POST: /demo-centers
  @access   private
  @desc     Create new demo center
*/
demoCenterModule.post("/", async (c) => {
  const validatedBody = await validateInput({
    type: "form",
    schema: demoCenterSchema,
    data: await c.req.json(),
  });

  const result = await demoCentersService.createDemoCenter(validatedBody);
  return c.json(result);
});

/*
  @route    GET: /demo-centers/:id
  @access   private
  @desc     Get demo center by id
*/
demoCenterModule.get("/:id", async (c) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const result = await demoCentersService.getDemoCenter(validatedParam.id);
  return c.json(result);
});

/*
  @route    PATCH: /demo-centers/:id/status
  @access   private
  @desc     Update demo center status (isPublic, blocked, blockReason)
*/
demoCenterModule.patch("/:id/status", async (c) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const validatedBody = await validateInput({
    type: "form",
    schema: updateDemoCenterStatusSchema,
    data: await c.req.json(),
  });

  const result = await demoCentersService.updateDemoCenterStatus(
    validatedParam.id,
    validatedBody,
  );
  return c.json(result);
});

/*
  @route    POST: /demo-centers/block
  @access   private
  @desc     Block demo center
*/
demoCenterModule.post("/block", async (c) => {
  const validatedBody = await validateInput({
    type: "form",
    schema: blockDemoCenterSchema,
    data: await c.req.json(),
  });

  const result = await demoCentersService.blockDemoCenter(validatedBody);
  return c.json(result);
});

/*
  @route    POST: /demo-centers/unblock
  @access   private
  @desc     Unblock demo center
*/
demoCenterModule.post("/unblock", async (c) => {
  const validatedBody = await validateInput({
    type: "form",
    schema: unblockDemoCenterSchema,
    data: await c.req.json(),
  });

  const result = await demoCentersService.unblockDemoCenter(validatedBody);
  return c.json(result);
});

/*
  @route    DELETE: /demo-centers/:id
  @access   private
  @desc     Delete demo center by id
*/
demoCenterModule.delete("/:id", async (c) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const result = await demoCentersService.deleteDemoCenter(validatedParam.id);
  return c.json(result);
});

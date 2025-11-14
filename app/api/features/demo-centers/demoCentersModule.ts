import {
  blockDemoCenterSchema,
  demoCenterQuerySchema,
  demoCenterSchema,
  unblockDemoCenterSchema,
  updateDemoCenterStatusSchema,
} from "@/schema/demoCenters";
import { paginationQuerySchema } from "@/schema/paginationSchema";
import { getSession } from "@/lib/auth";
import { Hono } from "hono";
import { object, string } from "yup";
import { validateInput } from "../../lib/validateInput";
import { demoCentersService } from "./demoCentersService";
import formSchemaModule from "./formSchemaModule";
import { formSubmissionService } from "./formSubmissionService";
import { auth } from "@/lib/auth";
import { HTTPException } from "hono/http-exception";

export const demoCenterModule = new Hono();

// Mount form schema routes
demoCenterModule.route("/form-schema", formSchemaModule);
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
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "super") {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const query = c.req.query();

    const validatedQuery = await validateInput({
      type: "query",
      schema:
        paginationQuerySchema &&
        object({
          search: string().optional(),
          buildingType: string().optional(),
          equipmentIds: string().optional(),
          isPublic: string().optional(),
          blocked: string().optional(),
          sortBy: string().optional(),
          sortOrder: string().optional(),
        }),
      data: query,
    });

    const result =
      await demoCentersService.getDemoCentersDashboard(validatedQuery);

    return c.json(result);
  } catch (error) {
    console.error("Error fetching demo centers dashboard:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch demo centers dashboard",
      },
      500,
    );
  }
});

/*
        @route    POST: /demo-centers
  @access   private
  @desc     Create new demo center
*/
demoCenterModule.post("/", async (c) => {
  const session = await getSession();

  const validatedBody = await validateInput({
    type: "form",
    schema: demoCenterSchema,
    data: await c.req.json(),
  });

  const result = await demoCentersService.createDemoCenter(
    validatedBody,
    session?.user?.id,
  );
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
  @route    PATCH: /demo-centers/:id
  @access   private
  @desc     Update demo center
*/
demoCenterModule.patch("/:id", async (c) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const validatedBody = await validateInput({
    type: "form",
    schema: demoCenterSchema,
    data: await c.req.json(),
  });

  const result = await demoCentersService.updateDemoCenter(
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

/*
  @route    POST: /demo-centers/apply
  @access   public
  @desc     Submit demo center application (public form)
*/
demoCenterModule.post("/apply", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  try {
    const body = await c.req.json();
    const { formData, buildingType } = body;

    if (!formData || !buildingType) {
      throw new HTTPException(400, {
        message: "Form data and building type are required",
      });
    }

    // Create a demo center application (stored as submission without demoCenterId for now)
    // You can modify this to create an actual DemoCenter or handle differently
    const application = {
      userId: session?.user?.id,
      buildingType,
      formData,
      status: "pending",
      createdAt: new Date(),
    };

    // For now, just return success. You can store this in a separate table or
    // create a pending DemoCenter entry
    return c.json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error: any) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: error.message });
  }
});

/*
  @route    POST: /demo-centers/:id/submit
  @access   public
  @desc     Submit demo center form (for existing demo center)
*/
demoCenterModule.post("/:id/submit", async (c) => {
  const demoCenterId = c.req.param("id");
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  try {
    const body = await c.req.json();
    const { formData } = body;

    if (!formData) {
      throw new HTTPException(400, { message: "Form data is required" });
    }

    const submission = await formSubmissionService.createSubmission({
      demoCenterId,
      userId: session?.user?.id,
      formData,
    });

    return c.json(submission);
  } catch (error: any) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: error.message });
  }
});

/*
  @route    GET: /demo-centers/:id/submissions
  @access   private (admin)
  @desc     Get all submissions for a demo center
*/
demoCenterModule.get("/:id/submissions", async (c) => {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "super") {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  const demoCenterId = c.req.param("id");

  try {
    const submissions =
      await formSubmissionService.getSubmissionsByDemoCenter(demoCenterId);
    return c.json(submissions);
  } catch (error: any) {
    throw new HTTPException(500, { message: error.message });
  }
});

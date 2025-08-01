import { exerciseLibraryVideoSchema } from "@/schema/exerciseLibraryVideo";
import { paginationQuerySchema } from "@/schema/paginationSchema";
import { Hono, type Context } from "hono";
import { object, string } from "yup";
import { validateInput } from "../../lib/validateInput";
import { exerciseLibraryVideoService } from "./exerciseLibraryVideoService";

export const exerciseLibraryVideoModule = new Hono();

/*
  @route    GET: /exercise-library-videos
  @access   private
  @desc     Get all exercise library videos
*/
exerciseLibraryVideoModule.get("/", async (c: Context) => {
  const validatedQuery = await validateInput({
    type: "query",
    schema: paginationQuerySchema,
    data: c.req.query(),
  });

  const result =
    await exerciseLibraryVideoService.getExerciseLibraryVideos(validatedQuery);
  return c.json(result);
});

/*
  @route    POST: /exercise-library-videos
  @access   private
  @desc     Create new exercise library video
*/
exerciseLibraryVideoModule.post("/", async (c: Context) => {
  const validatedBody = await validateInput({
    type: "form",
    schema: exerciseLibraryVideoSchema,
    data: await c.req.json(),
  });

  const result =
    await exerciseLibraryVideoService.createExerciseLibraryVideo(validatedBody);
  return c.json(result, 201);
});

/*
  @route    GET: /exercise-library-videos/:id
  @access   private
  @desc     Get exercise library video by id
*/
exerciseLibraryVideoModule.get("/:id", async (c: Context) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const result = await exerciseLibraryVideoService.getExerciseLibraryVideo(
    validatedParam.id,
  );
  return c.json(result);
});

/*
  @route    DELETE: /exercise-library-videos/:id
  @access   private
  @desc     Delete exercise library video by id
*/
exerciseLibraryVideoModule.delete("/:id", async (c: Context) => {
  const validatedParam = await validateInput({
    type: "param",
    schema: object({
      id: string().required(),
    }),
    data: c.req.param(),
  });

  const result = await exerciseLibraryVideoService.deleteExerciseLibraryVideo(
    validatedParam.id,
  );
  return c.json(result);
});

import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const errorHandler: ErrorHandler = (err, c) => {
  const env = process.env.NODE_ENV;

  if (err instanceof HTTPException) {
    return (
      err.res ??
      c.json(
        {
          message: err.message,
        },
        err.status,
      )
    );
  }

  return c.json(
    {
      message: env === "production" ? "Internal Server Error" : err.message,
      stack: env === "production" ? undefined : err.stack,
    },
    500,
  );
};

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { AppType } from "@api/[[...route]]/route";
import { hc } from "hono/client";

const { env } = await getCloudflareContext({ async: true });

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!, {
  fetch: env.WORKER_SELF_REFERENCE?.fetch.bind(env.WORKER_SELF_REFERENCE),
});

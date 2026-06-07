import { z } from "zod/mini";
import { HttpStatusCode } from "./http-status-code";
import { HttpFailureResponse } from "./http-failure-response";

export const HttpFailure = z.readonly(
  z.object({
    status: HttpStatusCode,
    response: HttpFailureResponse,
  }),
);

export type HttpFailure = z.infer<typeof HttpFailure>;

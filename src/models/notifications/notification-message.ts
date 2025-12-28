import type { HttpFailure } from "../http/http-failure";

export type NotificationMessage =
  | string
  | HttpFailure
  | {
      readonly message?: string;
      readonly subject?: string;
      readonly tag?: string;
    };

import type { ReactNode } from "react";
import type { HttpFailure } from "../http/http-failure";

export type NotificationMessage =
  | string
  | NonNullable<ReactNode>
  | HttpFailure
  | {
      readonly message?: NonNullable<ReactNode>;
      readonly subject?: NonNullable<ReactNode>;
      readonly tag?: NonNullable<ReactNode>;
    };

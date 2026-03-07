import type { ReactNode } from "react";
import type { NotificationLevel } from "./notification-level";
import type { NotificationMessage } from "./notification-message";

export interface Notification {
  readonly delay?: number;
  readonly message: NotificationMessage;
  readonly level: NotificationLevel;
  readonly title: NonNullable<ReactNode>;
}

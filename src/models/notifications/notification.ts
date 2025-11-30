import type { NotificationLevel } from "./notification-level";
import type { NotificationMessage } from "./notification-message";

export interface Notification {
  delay?: number;
  message: NotificationMessage;
  level: NotificationLevel;
  title: string;
}

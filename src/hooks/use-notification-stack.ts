import { useContext } from "react";
import { NotificationStack } from "../services/notifications/notification-stack";
import { NotificationStackContext } from "../contexts/notification-stack-context";

export function useNotificationStack() {
  return useContext(NotificationStackContext) ?? new NotificationStack();
}

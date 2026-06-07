import type { NotificationStack } from "../services/notifications/notification-stack";

import { createContext } from "react";

export const NotificationStackContext = createContext<
  NotificationStack | undefined
>(undefined);

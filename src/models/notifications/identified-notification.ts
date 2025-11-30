import type { UUID } from "../common/uuid";
import type { Notification } from "./notification";

export type IdentifiedNotification = Notification & {
  uuid: UUID;
};

import type { Dispatch, SetStateAction } from "react";
import type { Notification } from "../../models/notifications/notification";

export class NotificationStack {
  #notifications?: ReadonlyArray<Notification> = undefined;
  #setNotifications?: Dispatch<SetStateAction<ReadonlyArray<Notification>>> =
    undefined;

  get notifications() {
    return this.#notifications ?? ([] as ReadonlyArray<Notification>);
  }

  mount([notifications, setNotifications]: [
    ReadonlyArray<Notification>,
    Dispatch<SetStateAction<ReadonlyArray<Notification>>>,
  ]): void {
    this.#notifications = notifications;
    this.#setNotifications = setNotifications;
  }

  pushNotification(notification: Notification): void {
    this.#setNotifications?.((previous) => [...previous, notification]);
  }

  unmount(): void {
    this.#notifications = undefined;
    this.#setNotifications = undefined;
  }
}

import type { Notification } from "../../models/notifications/notification";
import type { NotificationStack } from "../../services/notifications/notification-stack";
import type { IdentifiedNotification } from "../../models/notifications/identified-notification";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";
import { ToastContainer } from "react-bootstrap";
import { NotificationToast } from "./notification-toast";
import { NotificationStackContext } from "../../contexts/notification-stack-context";

export interface NotificationStackProviderProps {
  readonly children?: ReactNode;
  readonly notificationStack: NotificationStack;
}

export function NotificationStackProvider({
  children,
  notificationStack,
}: NotificationStackProviderProps) {
  const [identifiedNotifications, setIdentifiedNotifications] = useState<
    ReadonlyArray<IdentifiedNotification>
  >([]);

  const setNotifications = useCallback(
    (setSateAction: SetStateAction<ReadonlyArray<Notification>>) =>
      typeof setSateAction === "function"
        ? setIdentifiedNotifications((previous) => [
            ...previous,
            ...setSateAction([]).map((notification) => ({
              ...notification,
              uuid: crypto.randomUUID(),
            })),
          ])
        : setIdentifiedNotifications(
            setSateAction.map((notification) => ({
              ...notification,
              uuid: crypto.randomUUID(),
            })),
          ),
    [setIdentifiedNotifications],
  );

  useEffect(() => {
    notificationStack.mount([identifiedNotifications, setNotifications]);
    return () => notificationStack.unmount();
  }, [identifiedNotifications, notificationStack, setNotifications]);

  return (
    <NotificationStackContext.Provider value={notificationStack}>
      {children}
      <ToastContainer className="m-4" position="bottom-end">
        {identifiedNotifications.map((identifiedNotification) => {
          const { uuid, ...notification } = identifiedNotification;
          return (
            <NotificationToast
              {...notification}
              key={uuid}
              onExited={() =>
                setIdentifiedNotifications((previous) =>
                  previous.filter((value) => value !== identifiedNotification),
                )
              }
            />
          );
        })}
      </ToastContainer>
    </NotificationStackContext.Provider>
  );
}

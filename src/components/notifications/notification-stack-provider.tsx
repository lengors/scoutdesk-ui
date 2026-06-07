import type { Notification } from "../../models/notifications/notification";
import type { NotificationStack } from "../../services/notifications/notification-stack";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useTranslation } from "react-i18next";
import { CardPanel } from "../common/card-panel";
import { Bell, Trash, X } from "react-bootstrap-icons";
import { NotificationToast } from "./notification-toast";
import { TooltipButton } from "../common/tooltip-button";
import { Badge, Collapse, Fade, ToastContainer } from "react-bootstrap";
import { identity, type Identifiable } from "../../models/common/identifiable";
import { NotificationStackContext } from "../../contexts/notification-stack-context";

export interface NotificationStackProviderProps {
  readonly children?: ReactNode;
  readonly notificationStack: NotificationStack;
}

export function NotificationStackProvider({
  children,
  notificationStack,
}: NotificationStackProviderProps) {
  const { t } = useTranslation();
  const [identifiableNotifications, setIdentifiableNotifications] = useState<
    ReadonlyArray<Identifiable<Notification>>
  >([]);
  const [show, setShow] = useState(false);
  const [showing, setShowing] = useState(false);

  const setNotifications = useCallback(
    (setSateAction: SetStateAction<ReadonlyArray<Notification>>) =>
      typeof setSateAction === "function"
        ? setIdentifiableNotifications((previous) => [
            ...previous,
            ...setSateAction([]).map((notification) => ({
              ...notification,
              [identity]: crypto.randomUUID(),
            })),
          ])
        : setIdentifiableNotifications(
            setSateAction.map((notification) => ({
              ...notification,
              [identity]: crypto.randomUUID(),
            })),
          ),
    [setIdentifiableNotifications],
  );

  useEffect(() => {
    notificationStack.mount([identifiableNotifications, setNotifications]);
    return () => notificationStack.unmount();
  }, [identifiableNotifications, notificationStack, setNotifications]);

  return (
    <NotificationStackContext.Provider value={notificationStack}>
      {children}
      <div className="d-flex min-vh-100 min-vw-100 pe-none position-fixed start-0 top-0 z-3">
        <ToastContainer
          className="align-self-end h-100 p-3 w-100"
          position="bottom-end"
        >
          <div className="align-items-end d-flex flex-column h-100 justify-content-end">
            <Collapse
              in={show && identifiableNotifications.length > 0}
              onExited={() => setShow(false)}
            >
              <div>
                <CardPanel className="overflow-y-auto">
                  {identifiableNotifications.map(
                    (identifiedNotification, index) => {
                      const { [identity]: key, ...notification } =
                        identifiedNotification;
                      return (
                        <NotificationToast
                          {...notification}
                          className={`flex-fill ${index > 0 ? "mt-3" : ""} w-100`}
                          key={key}
                          onExited={() =>
                            setIdentifiableNotifications((previous) =>
                              previous.filter(
                                (value) => value !== identifiedNotification,
                              ),
                            )
                          }
                        />
                      );
                    },
                  )}
                </CardPanel>
              </div>
            </Collapse>
            {(showing || identifiableNotifications.length > 0) && (
              <div className="align-items-center d-flex gap-2 mt-2">
                <Collapse dimension="width" in={show}>
                  <div>
                    <TooltipButton
                      className="pe-auto rounded-circle shadow"
                      onClick={() => setIdentifiableNotifications([])}
                      size="sm"
                      tooltip={t("common.clearNotifications")}
                      trigger={["focus", "hover"]}
                      variant="danger"
                    >
                      <Trash />
                    </TooltipButton>
                  </div>
                </Collapse>
                <div className="position-relative">
                  <TooltipButton
                    className="align-items-center d-flex justify-content-center pe-auto position-relative rounded-circle shadow"
                    onClick={() => setShow((previous) => !previous)}
                    style={{ height: "50px", width: "50px" }}
                    tooltip={t("common.notifications", { context: `${show}` })}
                    trigger={["focus", "hover"]}
                    variant="primary"
                  >
                    <Fade in={!show}>
                      <div className="position-absolute">
                        <Bell size={24} />
                      </div>
                    </Fade>
                    <Fade
                      in={show}
                      onEnter={() => setShowing(true)}
                      onExited={() => setShowing(false)}
                    >
                      <div className="position-absolute">
                        <X size={24} />
                      </div>
                    </Fade>
                  </TooltipButton>
                  <Fade in={!show && identifiableNotifications.length > 0}>
                    <Badge
                      bg="danger"
                      className="position-absolute start-100 top-0 translate-middle"
                      pill
                    >
                      {identifiableNotifications.length}
                    </Badge>
                  </Fade>
                </div>
              </div>
            )}
          </div>
        </ToastContainer>
      </div>
    </NotificationStackContext.Provider>
  );
}

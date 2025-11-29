import type { Notification } from "../../models/notifications/notification";

import { Fragment, useState } from "react";
import { Ratio, Toast } from "react-bootstrap";
import { ErrorRenderer } from "../common/error-renderer";

export interface NotificationToastProps extends Notification {
  readonly onExited?: (element: HTMLElement) => void;
}

export function NotificationToast({
  delay,
  message,
  level,
  onExited,
  title,
}: NotificationToastProps) {
  const [show, setShow] = useState(true);

  return (
    <Toast
      autohide={delay !== undefined}
      delay={delay}
      onClose={() => setShow(false)}
      onExited={onExited}
      show={show}
    >
      <Toast.Header>
        <Ratio
          aspectRatio="1x1"
          className={`bg-${level === "error" ? "danger" : level} rounded me-2`}
          style={{ flexBasis: "20px" }}
        >
          <Fragment />
        </Ratio>
        <strong className="me-auto">{title}</strong>
      </Toast.Header>
      <Toast.Body>
        <ErrorRenderer message={message} />
      </Toast.Body>
    </Toast>
  );
}

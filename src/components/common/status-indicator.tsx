import type { ReactNode } from "react";

import { Col, type ColProps, Container, Row } from "react-bootstrap";

export interface StatusIndicatorProps
  extends Pick<ColProps, "lg" | "md" | "sm" | "xl" | "xs" | "xxl"> {
  readonly children?: ReactNode;
}

export function StatusIndicator({ children, ...props }: StatusIndicatorProps) {
  return (
    <Container className="align-content-center flex-fill px-0" fluid>
      <Row className="align-items-center d-flex justify-content-center">
        <Col />
        <Col {...Object.assign({ xs: "auto" }, props)}>{children}</Col>
        <Col />
      </Row>
    </Container>
  );
}

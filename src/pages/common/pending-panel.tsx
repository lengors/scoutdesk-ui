import type { ReactNode } from "react";

import { Col, Container, Row } from "react-bootstrap";
import { PendingIndicator } from "../../components/common/pending-indicator";

export interface PendingPanelProps {
  readonly children?: ReactNode;
}

export function PendingPanel({ children }: PendingPanelProps) {
  return (
    <Container className="align-content-center flex-fill">
      <Row className="g-3">
        <Col xs={12}>
          <PendingIndicator borderWidth="0.375rem" height="3rem" width="3rem">
            {children}
          </PendingIndicator>
        </Col>
      </Row>
    </Container>
  );
}

import type { ReactNode } from "react";

import { StatusIndicator } from "./status-indicator";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useThemeContext } from "../../hooks/use-theme-context";

export interface PendingIndicatorProps {
  readonly borderWidth?: string;
  readonly children?: ReactNode;
  readonly height?: string;
  readonly width?: string;
}

export function PendingIndicator({
  borderWidth,
  children,
  height,
  width,
}: PendingIndicatorProps) {
  const { theme } = useThemeContext();

  return (
    <StatusIndicator>
      <Container className="px-0" fluid>
        <Row className="align-self-center g-3">
          <Col xs={12}>
            <Row>
              <Col />
              <Col xs="auto">
                <Spinner
                  animation="border"
                  style={{
                    borderWidth,
                    height,
                    width,
                  }}
                  variant={theme === "dark" ? "light" : "dark"}
                />
              </Col>
              <Col />
            </Row>
          </Col>
          {children !== undefined && (
            <Col xs={12}>
              {typeof children === "string" ? (
                <div className="d-flex">
                  <span className="flex-fill text-center">{children}</span>
                </div>
              ) : (
                children
              )}
            </Col>
          )}
        </Row>
      </Container>
    </StatusIndicator>
  );
}

import type { ReactNode } from "react";

import { Card } from "react-bootstrap";

export interface CardPanelProps {
  readonly children?: ReactNode;
  readonly footer?: ReactNode;
}

export function CardPanel({ children, footer }: CardPanelProps) {
  return (
    <Card className="border-0 rounded-3 shadow">
      <Card.Body>{children}</Card.Body>
      {footer !== undefined && <Card.Footer>{footer}</Card.Footer>}
    </Card>
  );
}

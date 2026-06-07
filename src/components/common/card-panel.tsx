import type { ReactNode } from "react";

import { Card } from "react-bootstrap";

export interface CardPanelProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly footer?: ReactNode;
}

export function CardPanel({ children, className, footer }: CardPanelProps) {
  return (
    <Card className="border-0 rounded-3 shadow">
      <Card.Body className={className}>{children}</Card.Body>
      {footer !== undefined && <Card.Footer>{footer}</Card.Footer>}
    </Card>
  );
}

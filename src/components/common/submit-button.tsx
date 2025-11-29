import type { ReactNode } from "react";
import type { ButtonVariant } from "react-bootstrap/types";

import { Button, Spinner } from "react-bootstrap";

export interface SubmitButtonProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly variant?: ButtonVariant;
}

export function SubmitButton({
  children,
  className,
  disabled,
  variant,
}: SubmitButtonProps) {
  return (
    <Button
      className={className}
      disabled={disabled}
      type="submit"
      variant={variant}
    >
      {disabled !== undefined && disabled && (
        <Spinner animation="border" className="me-1" size="sm" />
      )}
      {children}
    </Button>
  );
}

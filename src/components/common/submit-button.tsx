import type { ReactNode } from "react";
import type { ButtonVariant } from "react-bootstrap/types";

import { Button, Spinner } from "react-bootstrap";

export interface SubmitButtonProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly id?: string;
  readonly isLoading?: boolean;
  readonly variant?: ButtonVariant;
}

export function SubmitButton({
  children,
  className,
  disabled,
  id,
  isLoading,
  variant,
}: SubmitButtonProps) {
  return (
    <Button
      className={className}
      disabled={disabled}
      id={id}
      type="submit"
      variant={variant}
    >
      {(isLoading ?? disabled === true) && (
        <Spinner animation="border" className="me-1" size="sm" />
      )}
      {children}
    </Button>
  );
}

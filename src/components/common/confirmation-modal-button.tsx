import type { ButtonVariant } from "react-bootstrap/types";
import type { DefaultError, UseMutationResult } from "@tanstack/react-query";

import { ModalButton } from "./modal-button";
import { SubmitButton } from "./submit-button";
import { useTranslation } from "react-i18next";
import { useState, type ReactNode } from "react";
import { TooltipButton } from "./tooltip-button";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

export interface ConfirmationModalButtonProps<
  TData = unknown,
  TError = DefaultError,
  TVariables = unknown,
  TOnMutateResult = unknown,
> {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly message: string;
  readonly mutation: Pick<
    UseMutationResult<TData, TError, TVariables, TOnMutateResult>,
    "isPending" | "isSuccess" | "mutateAsync" | "reset"
  >;
  readonly size?: "lg" | "sm";
  readonly title: string;
  readonly tooltip?: ReactNode;
  readonly variables: TVariables;
  readonly variant?: ButtonVariant;
}

export function ConfirmationModalButton<
  TData = unknown,
  TError = DefaultError,
  TVariables = unknown,
  TOnMutateResult = unknown,
>({
  children,
  className,
  disabled,
  message,
  mutation: { isPending, isSuccess, mutateAsync, reset },
  size,
  title,
  tooltip,
  variables,
  variant,
}: ConfirmationModalButtonProps<TData, TError, TVariables, TOnMutateResult>) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [successTracker, setSuccessTracker] = useState(false);

  if (successTracker !== isSuccess) {
    setSuccessTracker(isSuccess);
    if (isSuccess) {
      setShow(false);
    }
  }

  return (
    <ModalButton
      button={
        tooltip !== undefined
          ? (props) => (
              <TooltipButton
                {...props}
                placement="auto-start"
                tooltip={tooltip}
                trigger={["focus", "hover"]}
              >
                {children}
              </TooltipButton>
            )
          : undefined
      }
      className={className}
      disabled={disabled}
      modal={(props) => (
        <Modal
          {...props}
          backdrop={isPending ? "static" : true}
          onExited={() => reset()}
        />
      )}
      setShow={setShow}
      show={show}
      size={size}
      variant={variant}
    >
      <Form
        noValidate
        onSubmit={async (event) => {
          event.preventDefault();
          event.stopPropagation();
          await mutateAsync(variables);
        }}
      >
        <Modal.Header closeButton={!isPending}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="g-3">
          <Row className="g-3">
            <Col xs={12}>
              <span className="h-5">{message}</span>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={isPending}
            onClick={() => setShow(false)}
            variant="secondary"
          >
            {t("common.cancel")}
          </Button>
          <SubmitButton disabled={isPending} variant={variant}>
            {t("common.confirm")}
          </SubmitButton>
        </Modal.Footer>
      </Form>
    </ModalButton>
  );
}

import type { ReactNode } from "react";
import type { ErrorMessage } from "../../models/errors/error-message";
import type { AnyRouter, ToPathOption } from "@tanstack/react-router";

import { ButtonLink } from "./button-link";
import { ErrorRenderer } from "./error-renderer";
import { Button, Col, Container, Row } from "react-bootstrap";

export type ErrorIndicatorProps<
  TRouter extends AnyRouter,
  TFrom extends string,
  TTo extends string | undefined,
> = {
  readonly message?: ErrorMessage;
  readonly subtitle?: ReactNode;
  readonly title?: ReactNode;
} & (
  | ({ readonly children: NonNullable<ReactNode> } & (
      | {
          readonly onClick?: never;
          readonly to: NonNullable<ToPathOption<TRouter, TFrom, TTo>>;
        }
      | {
          readonly onClick: () => void;
          readonly to?: never;
        }
    ))
  | {
      readonly children?: never;
    }
);

export function ErrorIndicator<
  TRouter extends AnyRouter,
  TFrom extends string,
  TTo extends string | undefined,
>({
  message,
  subtitle,
  title,
  ...props
}: ErrorIndicatorProps<TRouter, TFrom, TTo>) {
  return (
    <Container className="align-content-center align-self-center flex-fill">
      <Row className="g-3">
        <Col xs={12} />
        <Col />
        <Col className="text-center" xs="auto">
          {title !== undefined && (
            <h1 className="display-1 fw-bold text-primary">{title}</h1>
          )}
          {subtitle !== undefined && <h2 className="mb-4">{subtitle}</h2>}
          {message !== undefined && (
            <p className="lead mb-4 text-muted">
              <ErrorRenderer message={message} />
            </p>
          )}
          <Row className="g-3">
            <Col />
            {props.children !== undefined && (
              <Col xs="auto">
                {props.onClick !== undefined ? (
                  <Button onClick={props.onClick} size="lg" variant="primary">
                    {props.children}
                  </Button>
                ) : (
                  <ButtonLink size="lg" to={props.to} variant="primary">
                    {props.children}
                  </ButtonLink>
                )}
              </Col>
            )}
            <Col xs="auto">
              <Button
                onClick={() => window.history.back()}
                size="lg"
                variant="outline-secondary"
              >
                Go Back
              </Button>
            </Col>
            <Col />
          </Row>
        </Col>
        <Col />
      </Row>
    </Container>
  );
}

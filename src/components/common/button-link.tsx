import { forwardRef } from "react";
import { Button, type ButtonProps } from "react-bootstrap";
import { createLink, type LinkComponent } from "@tanstack/react-router";

export type ButtonLinkProps = Omit<ButtonProps, "as" | "href">;

const ButtonLinkComponent = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (props, ref) => <Button as="a" ref={ref} {...props} />,
);

const CreatedButtonLink = createLink(ButtonLinkComponent);

export const ButtonLink: LinkComponent<typeof ButtonLinkComponent> = (
  props,
) => <CreatedButtonLink preload="intent" {...props} />;

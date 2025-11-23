import { forwardRef } from "react";
import { Nav, type NavLinkProps } from "react-bootstrap";
import { createLink, type LinkComponent } from "@tanstack/react-router";

export type HeaderLinkProps = Omit<NavLinkProps, "href">;

const HeaderLinkComponent = forwardRef<HTMLAnchorElement, HeaderLinkProps>(
  (props, ref) => <Nav.Link ref={ref} {...props} />,
);

const CreatedHeaderLink = createLink(HeaderLinkComponent);

export const HeaderLink: LinkComponent<typeof HeaderLinkComponent> = (
  props,
) => <CreatedHeaderLink preload="intent" {...props} />;

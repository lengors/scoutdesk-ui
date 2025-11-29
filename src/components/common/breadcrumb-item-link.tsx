import { forwardRef } from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { BreadcrumbItem, type BreadcrumbItemProps } from "react-bootstrap";

export type BreadcrumbItemLinkProps = Omit<BreadcrumbItemProps, "href">;

const BreadcrumbItemLinkComponent = forwardRef<
  HTMLAnchorElement,
  BreadcrumbItemLinkProps
>((props, ref) => <BreadcrumbItem ref={ref} {...props} />);

const CreatedBreadcrumbItemLink = createLink(BreadcrumbItemLinkComponent);

export const BreadcrumbItemLink: LinkComponent<
  typeof BreadcrumbItemLinkComponent
> = (props) => <CreatedBreadcrumbItemLink preload="intent" {...props} />;

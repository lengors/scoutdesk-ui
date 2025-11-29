import { forwardRef } from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { TooltipButton, type TooltipButtonProps } from "./tooltip-button";

export type TooltipButtonLinkProps = Omit<TooltipButtonProps, "as" | "href">;

const TooltipButtonLinkComponent = forwardRef<
  HTMLAnchorElement,
  TooltipButtonLinkProps
>((props, ref) => <TooltipButton as="a" ref={ref} {...props} />);

const CreatedTooltipButtonLink = createLink(TooltipButtonLinkComponent);

export const TooltipButtonLink: LinkComponent<
  typeof TooltipButtonLinkComponent
> = (props) => <CreatedTooltipButtonLink preload="intent" {...props} />;

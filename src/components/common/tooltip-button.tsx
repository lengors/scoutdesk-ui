import type { Placement } from "react-bootstrap/types";
import type { OverlayTriggerType } from "react-bootstrap/OverlayTrigger";

import { Button, type ButtonProps } from "react-bootstrap";
import { OverlayTriggerTooltip } from "./overlay-trigger-tooltip";
import { type ComponentRef, forwardRef, type ReactNode, type Ref } from "react";

export interface TooltipButtonProps extends ButtonProps {
  readonly children?: ReactNode;
  readonly placement?: Placement;
  readonly tooltip: ReactNode;
  readonly tooltipArrowClassName?: string;
  readonly tooltipClassName?: string;
  readonly trigger?: OverlayTriggerType | Array<OverlayTriggerType>;
}

export const TooltipButton = forwardRef(
  (
    {
      children,
      placement,
      tooltip,
      tooltipArrowClassName,
      tooltipClassName,
      trigger,
      ...props
    }: TooltipButtonProps,
    ref: Ref<ComponentRef<"a" | "button">>,
  ) => (
    <OverlayTriggerTooltip
      placement={placement}
      tooltip={tooltip}
      tooltipArrowClassName={tooltipArrowClassName}
      tooltipClassName={tooltipClassName}
      trigger={trigger}
    >
      <Button ref={ref} {...props}>
        {children}
      </Button>
    </OverlayTriggerTooltip>
  ),
);

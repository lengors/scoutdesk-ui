import type { Placement } from "react-bootstrap/types";
import type { OverlayTriggerType } from "react-bootstrap/OverlayTrigger";

import { Form, type FormControlProps } from "react-bootstrap";
import { OverlayTriggerTooltip } from "./overlay-trigger-tooltip";
import { forwardRef, type ComponentRef, type ReactNode, type Ref } from "react";

export interface TooltipFormControlProps extends FormControlProps {
  readonly placement?: Placement;
  readonly tooltip?: ReactNode;
  readonly tooltipArrowClassName?: string;
  readonly tooltipClassName?: string;
  readonly trigger?: OverlayTriggerType | Array<OverlayTriggerType>;
}

export const TooltipFormControl = forwardRef(
  (
    {
      placement,
      tooltip,
      tooltipArrowClassName,
      tooltipClassName,
      trigger,
      ...props
    }: TooltipFormControlProps,
    ref: Ref<ComponentRef<"input">>,
  ) => (
    <OverlayTriggerTooltip
      placement={placement}
      tooltip={tooltip}
      tooltipArrowClassName={tooltipArrowClassName}
      tooltipClassName={tooltipClassName}
      trigger={trigger}
    >
      <Form.Control {...props} ref={ref} />
    </OverlayTriggerTooltip>
  ),
);

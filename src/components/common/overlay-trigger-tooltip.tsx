import type { Placement } from "react-bootstrap/types";
import type { OverlayTriggerType } from "react-bootstrap/OverlayTrigger";

import {
  OverlayTrigger,
  type OverlayTriggerProps,
  Tooltip,
} from "react-bootstrap";
import { isEmpty } from "../../utils/common";
import { type ReactNode, useMemo, useState } from "react";
import { useThemeContext } from "../../hooks/use-theme-context";

import "./overlay-trigger-tooltip.css";

export interface OverlayTriggerTooltipProps {
  readonly children: OverlayTriggerProps["children"];
  readonly placement?: Placement;
  readonly tooltip: ReactNode;
  readonly tooltipArrowClassName?: string;
  readonly tooltipClassName?: string;
  readonly trigger?: OverlayTriggerType | Array<OverlayTriggerType>;
}

export function OverlayTriggerTooltip({
  children,
  placement,
  tooltip,
  tooltipArrowClassName,
  tooltipClassName,
  trigger,
}: OverlayTriggerTooltipProps) {
  const { theme } = useThemeContext();
  const [show, setShow] = useState(false);

  const isTooltipEmpty = useMemo(() => isEmpty(tooltip), [tooltip]);

  return (
    <OverlayTrigger
      onToggle={setShow}
      overlay={(props) => (
        <Tooltip
          {...Object.assign(props, {
            arrowProps: Object.assign(props.arrowProps, {
              className: `border-${theme}-subtle tooltip-arrow ${tooltipArrowClassName}`,
            }),
            className: `bg-body-secondary inherit opacity-100 rounded-3 shadow text-body ${tooltipClassName}`,
          })}
        >
          {tooltip}
        </Tooltip>
      )}
      placement={placement ?? "auto"}
      show={show && !isTooltipEmpty}
      trigger={trigger}
    >
      {children}
    </OverlayTrigger>
  );
}

import { sleep } from "../../utils/time";
import { isEmpty } from "../../utils/common";
import { Fragment, useMemo, useRef, useState } from "react";
import { useThemeContext } from "../../hooks/use-theme-context";
import { Clipboard, ClipboardCheck } from "react-bootstrap-icons";
import { TooltipButton, type TooltipButtonProps } from "./tooltip-button";

export interface CopyButtonProps
  extends Omit<TooltipButtonProps, "children" | "tooltip"> {
  readonly children?: TooltipButtonProps["value"];
}

export function CopyButton({
  children,
  className,
  disabled,
  placement,
  trigger,
  value,
  variant,
  ...props
}: CopyButtonProps) {
  const { theme } = useThemeContext();
  const [copied, setCopied] = useState(false);
  const content = useMemo(() => value ?? children, [children, value]);
  const contentIsEmpty = useMemo(() => isEmpty(content), [content]);

  const counter = useRef(0);

  const copyToClipboard = async () => {
    let textToCopy: string;
    if (typeof content === "string") {
      textToCopy = content;
    } else if (typeof content === "number") {
      textToCopy = content.toString();
    } else if (content === undefined) {
      textToCopy = "";
    } else {
      textToCopy = content.join("; ");
    }

    await navigator.clipboard.writeText(textToCopy);
    setCopied(++counter.current > 0);
    await sleep(750);
    setCopied(--counter.current > 0);
  };

  return (
    <Fragment>
      <TooltipButton
        {...props}
        className={className ?? (children !== undefined ? "me-2" : undefined)}
        onClick={copyToClipboard}
        placement={placement ?? "auto-start"}
        tooltip="Copy to clipboard"
        trigger={trigger ?? ["focus", "hover"]}
        variant={variant ?? theme}
        disabled={disabled || contentIsEmpty}
      >
        {copied ? <ClipboardCheck /> : <Clipboard />}
      </TooltipButton>
      {children}
    </Fragment>
  );
}

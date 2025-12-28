import { Fragment, type ReactNode } from "react";

export type ScraperMetricProps = {
  readonly leading?: ReactNode;
  readonly trailing?: ReactNode;
} & (
  | {
      readonly children?: never;
      readonly icon: ReactNode;
    }
  | {
      readonly children: ReactNode;
      readonly icon?: never;
    }
);

export function ScraperMetric({
  children,
  icon,
  leading,
  trailing,
}: ScraperMetricProps) {
  return (
    <Fragment>
      <div className="vr mx-2"></div>
      {leading !== undefined && <span className="me-1">{leading}</span>}
      {children ?? icon}
      {trailing !== undefined && <span className="ms-1">{trailing}</span>}
    </Fragment>
  );
}

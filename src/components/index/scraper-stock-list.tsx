import type { ScraperEntryStock } from "../../models/scrapers/scraper-entry-stock";

import { useMemo } from "react";
import { capitalize } from "../../utils/string";
import { Badge, Carousel } from "react-bootstrap";
import { CalendarRange } from "react-bootstrap-icons";
import { useThemeContext } from "../../hooks/use-theme-context";

import "./scraper-stock-list.css";

export interface ScraperStockListProps {
  readonly stocks: ReadonlyArray<ScraperEntryStock>;
}

export function ScraperStockList({ stocks }: ScraperStockListProps) {
  const { theme } = useThemeContext();

  const parsedStocks = useMemo(
    () =>
      stocks.map(({ availability, deliveringOn, ...rest }) => {
        let availabilityParsed: string;
        if (availability.modifier === "exact") {
          availabilityParsed = `${availability.amount}`;
        } else {
          availabilityParsed = `${
            availability.modifier === "at_least" ? ">=" : "<="
          }${availability.amount}`;
        }

        if (deliveringOn === undefined) {
          return {
            ...rest,
            availability: availabilityParsed,
            deliveringOn: undefined,
          } as const;
        }

        if ("value" in deliveringOn) {
          const relative = deliveringOn.value.toRelativeCalendar({
            unit: deliveringOn.grain,
          });
          return {
            ...rest,
            availability: availabilityParsed,
            deliveringOn: relative === null ? null : capitalize(relative),
          } as const;
        }

        const fromRelative = deliveringOn.from.value.toRelativeCalendar({
          unit: deliveringOn.from.grain,
        });
        const toRelative = deliveringOn.to.value.toRelativeCalendar({
          unit: deliveringOn.to.grain,
        });

        if (toRelative === null) {
          return fromRelative === null
            ? ({
                ...rest,
                availability: availabilityParsed,
                deliveringOn: null,
              } as const)
            : ({
                ...rest,
                availability: availabilityParsed,
                deliveringOn: capitalize(fromRelative),
              } as const);
        }

        if (fromRelative === null) {
          return {
            ...rest,
            availability: availabilityParsed,
            deliveringOn: capitalize(toRelative),
          } as const;
        }

        return {
          ...rest,
          availability: availabilityParsed,
          deliveringOn: {
            from: capitalize(fromRelative),
            to: capitalize(toRelative),
          },
        } as const;
      }),
    [stocks],
  );
  return (
    <Carousel
      className="d-flex stock-list"
      fade
      indicators={false}
      interval={null}
      variant="dark"
    >
      {parsedStocks.map(
        ({ availability, deliveringOn, storage }, stockIndex) => (
          <Carousel.Item key={stockIndex}>
            <div className="align-items-center d-flex justify-content-between align-items-stretch">
              {(deliveringOn !== undefined || storage !== undefined) && (
                <small className="flex-fill me-2">
                  <div className="lh-1 text-start">
                    {storage !== undefined && (
                      <p className="mb-0 text-nowrap">{storage}</p>
                    )}
                    {deliveringOn !== undefined && deliveringOn !== null && (
                      <small className="text-muted">
                        {typeof deliveringOn === "string" ? (
                          <small>{deliveringOn}</small>
                        ) : (
                          <small className="text-nowrap">
                            {deliveringOn.from}
                            <CalendarRange className="mx-1" />
                            {deliveringOn.to}
                          </small>
                        )}
                      </small>
                    )}
                  </div>
                </small>
              )}
              <Badge
                bg={theme}
                className={`border border-${theme === "dark" ? "light" : "dark"} fw-normal lh-base`}
                pill
                text={theme === "dark" ? "light" : "dark"}
              >
                {availability}
              </Badge>
            </div>
          </Carousel.Item>
        ),
      )}
    </Carousel>
  );
}

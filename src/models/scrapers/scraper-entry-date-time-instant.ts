import type { DateTime, ToRelativeUnit } from "luxon";

export type ScraperEntryDateTimeInstant = {
  readonly value: DateTime;
  readonly grain: ToRelativeUnit;
};

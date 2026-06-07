import type { ScraperEntry } from "../../models/scrapers/scraper-entry";

import { identity, type Identifiable } from "../../models/common/identifiable";

export function scraperPriceSorter(
  {
    [identity]: leftIdentity,
    price: { amount: leftAmount },
  }: Identifiable<ScraperEntry, number>,
  {
    [identity]: rightIdentity,
    price: { amount: rightAmount },
  }: Identifiable<ScraperEntry, number>,
) {
  const difference = leftAmount - rightAmount;
  if (difference !== 0) {
    return difference;
  }

  return leftIdentity - rightIdentity;
}

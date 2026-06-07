export const SCRAPERS_KEY = ["scrapers"] as const;

export function scrapersKey(
  searchTerm: string,
  profiles: ReadonlyArray<string>,
) {
  return [...SCRAPERS_KEY, searchTerm, profiles] as const;
}

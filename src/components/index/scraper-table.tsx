import type { Key } from "react";
import type { ArrayLike } from "../../collections/array-like";
import type { ScraperEntry } from "../../models/scrapers/scraper-entry";

import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ScraperTableEntry } from "./scraper-table-entry";
import { identity, type Identifiable } from "../../models/common/identifiable";

export interface ScraperTableProps {
  readonly entries: ArrayLike<Identifiable<ScraperEntry, Key>>;
}

export function ScraperTable({ entries }: ScraperTableProps) {
  const { t } = useTranslation();

  return (
    <Table
      className="align-middle mb-0 text-center text-nowrap"
      hover
      responsive
      striped
    >
      <thead>
        <tr>
          <th style={{ width: 0 }}>{t("scraper.picture")}</th>
          <th className="text-start">{t("scraper.description")}</th>
          <th style={{ width: 0 }}>{t("scraper.stock")}</th>
          <th style={{ width: 0 }}>{t("scraper.price")}</th>
          <th style={{ width: 0 }}>{t("scraper.website")}</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(({ [identity]: key, ...entry }) => (
          <ScraperTableEntry entry={entry} key={key} />
        ))}
      </tbody>
    </Table>
  );
}

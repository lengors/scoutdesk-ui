import type { Key } from "react";
import type { ArrayLike } from "../../collections/array-like";
import type { ScraperEntry } from "../../models/scrapers/scraper-entry";

import { Table } from "react-bootstrap";
import { ScraperTableEntry } from "./scraper-table-entry";
import { identity, type Identifiable } from "../../models/common/identifiable";

export interface ScraperTableProps {
  readonly entries: ArrayLike<Identifiable<ScraperEntry, Key>>;
}

export function ScraperTable({ entries }: ScraperTableProps) {
  return (
    <Table
      className="align-middle mb-0 text-center text-nowrap"
      hover
      responsive
      striped
    >
      <thead>
        <tr>
          <th style={{ width: 0 }}>Picture</th>
          <th className="text-start">Description</th>
          <th style={{ width: 0 }}>Stock</th>
          <th style={{ width: 0 }}>Price</th>
          <th style={{ width: 0 }}>Website</th>
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

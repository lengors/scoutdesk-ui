import type { ScraperEntry } from "../../models/scrapers/scraper-entry";

import { capitalize } from "../../utils/text";
import { Image, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ScraperMetric } from "./scraper-metric";
import { ScraperStockList } from "./scraper-stock-list";
import { OverlayTriggerTooltip } from "../common/overlay-trigger-tooltip";
import {
  CloudRainHeavyFill,
  FuelPumpFill,
  InfoCircleFill,
  VolumeUpFill,
} from "react-bootstrap-icons";

export interface ScraperTableEntryProps {
  readonly entry: ScraperEntry;
}

export function ScraperTableEntry({
  entry: {
    url,
    specificationName,
    description,
    brand: { image: brandImage, description: brandDescription },
    price,
    image,
    stocks,
    grip,
    noise,
    decibels,
    consumption,
    details,
  },
}: ScraperTableEntryProps) {
  const { t } = useTranslation();
  return (
    <tr>
      <td>
        {(image?.trim()?.length ?? 0) > 0 && (
          <Image src={image} thumbnail style={{ height: 38 }} />
        )}
      </td>
      <td className="text-start">
        <div>
          <small className="d-flex lh-1">
            {(brandImage?.trim()?.length ?? 0) > 0 ? (
              <Image
                alt={brandDescription}
                fluid
                src={brandImage}
                style={{ height: 14 }}
                title={brandDescription}
              />
            ) : (
              <span>{brandDescription}</span>
            )}
            {consumption !== undefined && (
              <ScraperMetric trailing={consumption.toUpperCase()}>
                <FuelPumpFill />
              </ScraperMetric>
            )}
            {grip !== undefined && (
              <ScraperMetric trailing={grip.toUpperCase()}>
                <CloudRainHeavyFill />
              </ScraperMetric>
            )}
            {(noise !== undefined || decibels !== undefined) && (
              <ScraperMetric
                leading={decibels}
                trailing={
                  noise === undefined
                    ? undefined
                    : Number.parseInt(noise, 36) - 9
                }
              >
                <VolumeUpFill />
              </ScraperMetric>
            )}
            {(details?.length ?? 0) > 0 && (
              <ScraperMetric>
                <OverlayTriggerTooltip
                  placement="auto-start"
                  tooltip={
                    <Table className="mb-0" hover striped>
                      <tbody>
                        {details?.map((detail, index) => (
                          <tr className="align-middle text-start" key={index}>
                            <td colSpan={"description" in detail ? 1 : 2}>
                              {detail.image === undefined ? (
                                detail.name
                              ) : (
                                <Image
                                  alt={detail.name}
                                  src={detail.image}
                                  style={{ height: 30 }}
                                  thumbnail
                                  title={detail.name}
                                />
                              )}
                            </td>
                            {"description" in detail && (
                              <td>{detail.description}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  }
                  trigger={["focus", "hover"]}
                >
                  <InfoCircleFill />
                </OverlayTriggerTooltip>
              </ScraperMetric>
            )}
          </small>
        </div>
        <p className="mb-0">{description}</p>
      </td>
      <td>
        {(stocks?.length ?? 0) > 0 && <ScraperStockList stocks={stocks} />}
      </td>
      <td>
        {Math.abs(price.amount) < Number.EPSILON
          ? t("scraper.notApplicable")
          : `€${price.amount}`}
      </td>
      <td>
        <a href={url} rel="noopener noreferrer" target="_blank">
          {capitalize(specificationName)}
        </a>
      </td>
    </tr>
  );
}

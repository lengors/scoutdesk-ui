import type { UseFormReturn } from "react-hook-form";
import type { ScraperEntry } from "../../models/scrapers/scraper-entry";

import { ScraperForm } from "./scraper-form";
import { List } from "react-bootstrap-icons";
import { capitalize } from "../../utils/text";
import { ScraperTable } from "./scraper-table";
import { useTranslation } from "react-i18next";
import { Paginated } from "../common/paginated";
import { CardPanel } from "../common/card-panel";
import { useQuery } from "@tanstack/react-query";
import { StatusIndicator } from "../common/status-indicator";
import { scrapOptions } from "../../options/scrapers/scraper-query-options";
import { identity, type Identifiable } from "../../models/common/identifiable";
import { ScraperStateManager } from "../../domain/scrapers/scraper-state-manager";
import { profilesQueryOptions } from "../../options/profiles/profile-query-options";
import {
  useCallback,
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  Form,
  Offcanvas,
  ProgressBar,
  Row,
} from "react-bootstrap";

export interface ScraperViewProps {
  readonly form: Pick<
    UseFormReturn<{ readonly query: string }>,
    "control" | "formState" | "handleSubmit"
  >;
  readonly query: string;
}

export function ScraperView({ form: queryForm, query }: ScraperViewProps) {
  const { t } = useTranslation();
  const toggleButtonId = useId();
  const [stateManager] = useState(() => new ScraperStateManager(20));
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const { data: profiles } = useQuery(profilesQueryOptions);

  // TODO Refactor logic once reducer is guaranteed to be called only once per entry
  const { fetchStatus } = useQuery(
    scrapOptions(query, profiles ?? [], {
      initialValue: stateManager,
      reducer: (acc, chunk) => {
        if (identity in chunk) {
          return acc;
        }

        Object.defineProperty(chunk, identity, {
          configurable: false,
          enumerable: false,
          value: acc.size,
          writable: false,
        });
        return acc.insert(chunk as Identifiable<ScraperEntry, number>);
      },
      reset: (initialValue) => initialValue.reset(),
    }),
  );

  const setPageOffset = useCallback(
    (page: number | ((page: number) => number)) =>
      stateManager.setBatchOffset(
        typeof page === "number"
          ? page
          : page(stateManager.snapshot.batchOffset),
      ),
    [stateManager],
  );
  const setPageSize = useCallback(
    (size: number | ((size: number) => number)) =>
      stateManager.setBatchSize(
        typeof size === "number" ? size : size(stateManager.snapshot.batchSize),
      ),
    [stateManager],
  );
  const snapshot = useCallback(() => stateManager.snapshot, [stateManager]);
  const subscribe = useCallback(
    (listener: () => void) => stateManager.subscribe(listener),
    [stateManager],
  );

  const {
    batch: paginatedEntries,
    batchOffset: pageOffset,
    batchSize: pageSize,
    brands,
    count,
    direction: entryDirection,
    selectionMode,
  } = useSyncExternalStore(subscribe, snapshot);

  // Flush remaining entries when fetching is done
  useEffect(() => {
    if (fetchStatus !== "fetching") {
      stateManager.flush();
    }
  }, [fetchStatus, stateManager]);

  return (
    <Container fluid="lg">
      <Row className="align-self-start flex-grow-1 g-3 mb-3">
        <Col xs={12} />
        <Col className="d-none d-lg-block" lg={4}>
          <CardPanel>
            <Offcanvas
              onHide={() => setShowAdvancedSearch(false)}
              show={showAdvancedSearch}
              responsive="lg"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>{t("scraper.advancedSearch")}</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Container className="p-0" fluid>
                  <Form noValidate>
                    <Row className="g-3">
                      <Col xs={12}>
                        <Accordion alwaysOpen flush>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              {t("scraper.brands")}
                            </Accordion.Header>
                            <Accordion.Body>
                              <Form.Group>
                                <Form.Check
                                  checked={selectionMode === "all"}
                                  label={t("scraper.allBrands")}
                                  onChange={(event) =>
                                    stateManager.selectAll(
                                      event.target.checked ? "all" : "none",
                                    )
                                  }
                                  ref={(instance) => {
                                    if (instance !== null) {
                                      instance.indeterminate =
                                        selectionMode === "indeterminate";
                                    }
                                  }}
                                  type="checkbox"
                                />
                                {brands.map(([value, checkedValue]) => (
                                  <Form.Check
                                    checked={checkedValue}
                                    key={value}
                                    label={capitalize(value)}
                                    onChange={(event) =>
                                      stateManager.toggleBrand(
                                        value,
                                        event.target.checked,
                                      )
                                    }
                                    type="checkbox"
                                  />
                                ))}
                              </Form.Group>
                            </Accordion.Body>
                          </Accordion.Item>
                          <Accordion.Item eventKey="1">
                            <Accordion.Header>
                              {t("scraper.sortBy")}
                            </Accordion.Header>
                            <Accordion.Body>
                              <Form.Group>
                                <Form.Label>{t("scraper.price")}</Form.Label>
                                <Form.Check
                                  checked={entryDirection === "forward"}
                                  label={t("scraper.ascendingPrice")}
                                  onChange={() =>
                                    stateManager.sort("price.asc")
                                  }
                                  type="radio"
                                  value="asc"
                                />
                                <Form.Check
                                  checked={entryDirection === "backward"}
                                  label={t("scraper.descendingPrice")}
                                  onChange={() =>
                                    stateManager.sort("price.desc")
                                  }
                                  type="radio"
                                  value="desc"
                                />
                              </Form.Group>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </Col>
                    </Row>
                  </Form>
                </Container>
              </Offcanvas.Body>
            </Offcanvas>
          </CardPanel>
        </Col>
        <Col xs={12} lg={8}>
          <Row className="g-3">
            <Col xs={12}>
              <ScraperForm form={queryForm}>
                <Col className="d-lg-none" xs="auto">
                  <Form.Group>
                    <Form.Label
                      className="invisible"
                      htmlFor={toggleButtonId}
                      style={{ whiteSpace: "pre" }}
                    >
                      {" "}
                    </Form.Label>
                    <Form.Control
                      as={Button}
                      id={toggleButtonId}
                      onClick={() => setShowAdvancedSearch(true)}
                      type="button"
                      variant="outline-secondary"
                    >
                      <List />
                    </Form.Control>
                  </Form.Group>
                </Col>
                {fetchStatus === "fetching" && (
                  <Col className="order-5" xs={12}>
                    <ProgressBar
                      animated
                      now={100}
                      label={t("common.loading")}
                    />
                  </Col>
                )}
              </ScraperForm>
            </Col>
            <Col xs={12}>
              {count === 0 && fetchStatus !== "fetching" ? (
                <CardPanel>
                  <Row className="g-3">
                    <Col xs={12}>
                      <StatusIndicator>
                        {t("scraper.noResults")}
                      </StatusIndicator>
                    </Col>
                  </Row>
                </CardPanel>
              ) : (
                <Paginated
                  count={count}
                  entries={paginatedEntries}
                  page={pageOffset}
                  render={(paginatedEntries) => (
                    <CardPanel>
                      <Row className="g-3">
                        <Col xs={12}>
                          <ScraperTable entries={paginatedEntries} />
                        </Col>
                      </Row>
                    </CardPanel>
                  )}
                  setPage={setPageOffset}
                  setSize={setPageSize}
                  size={pageSize}
                  sizeOptions={[20, 50, 100]}
                  span={3}
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

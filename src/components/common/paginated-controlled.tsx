import type { PaginatedProps } from "./paginated";

import { Col, Form, Pagination, Row } from "react-bootstrap";
import { useMemo, type Dispatch, type SetStateAction } from "react";

export type PaginatedControlledProps<TEntry> = Omit<
  PaginatedProps<TEntry>,
  "page" | "setPage"
> & {
  readonly page: number;
  readonly setPage: Dispatch<SetStateAction<number>>;
};

export function PaginatedControlled<TEntry>({
  count,
  entries,
  page,
  render,
  setPage,
  setSize,
  size,
  sizeOptions,
  span,
}: PaginatedControlledProps<TEntry>) {
  const entriesLength = useMemo(
    () => ("length" in entries ? entries.length : entries.size),
    [entries],
  );
  const totalPages = useMemo(
    () =>
      Math.ceil(
        (count === undefined ? entriesLength : Math.max(count, entriesLength)) /
          size,
      ),
    [count, entriesLength, size],
  );

  const effectivePage = useMemo(
    () => Math.max(0, Math.min(page, totalPages - 1)),
    [page, totalPages],
  );

  const spanProbableStartPage = useMemo(
    () => Math.max(0, effectivePage - span),
    [effectivePage, span],
  );
  const spanEndPage = useMemo(
    () => Math.min(totalPages - 1, spanProbableStartPage + span * 2),
    [span, spanProbableStartPage, totalPages],
  );
  const spanStartPage = useMemo(
    () => Math.max(0, spanEndPage - span * 2),
    [span, spanEndPage],
  );
  const spanPages = useMemo(() => {
    const pages = [];
    for (let page = spanStartPage; page <= spanEndPage; page++) {
      pages.push(page);
    }
    return pages;
  }, [spanStartPage, spanEndPage]);

  const paginatedEntries = useMemo(() => {
    if (entriesLength <= size) {
      return entries;
    }

    const end = effectivePage * size;
    return entries.slice(end - size, end);
  }, [effectivePage, entries, entriesLength, size]);

  return (
    <Row className="g-3">
      <Col xs={12}>{render(paginatedEntries)}</Col>
      {(totalPages > 1 || setSize !== undefined) && (
        <Col xs={12}>
          <div className="align-items-center d-flex overflow-x-auto">
            <div className="flex-grow-1" style={{ flexBasis: 0 }} />
            {totalPages > 1 && (
              <Pagination className="mb-0">
                <Pagination.First
                  onClick={() => setPage(0)}
                  disabled={effectivePage === 0}
                />
                <Pagination.Prev
                  onClick={() => setPage((page) => Math.max(0, page - 1))}
                  disabled={effectivePage === 0}
                />
                {spanPages.map((page, index) =>
                  (index === 0 && page !== 0) ||
                  (index === spanPages.length - 1 &&
                    page !== totalPages - 1) ? (
                    <Pagination.Ellipsis key={page} disabled />
                  ) : (
                    <Pagination.Item
                      key={page}
                      active={page === effectivePage}
                      onClick={() => setPage(page)}
                    >
                      {page + 1}
                    </Pagination.Item>
                  ),
                )}
                <Pagination.Next
                  onClick={() =>
                    setPage((page) => Math.min(totalPages - 1, page + 1))
                  }
                  disabled={effectivePage >= totalPages - 1}
                />
                <Pagination.Last
                  onClick={() => setPage(totalPages - 1)}
                  disabled={effectivePage >= totalPages - 1}
                />
              </Pagination>
            )}
            <div
              className="d-flex flex-grow-1 justify-content-end"
              style={{ flexBasis: 0 }}
            >
              {setSize !== undefined && (
                <Form.Select
                  className={`${totalPages > 1 ? "ms-3" : ""} w-auto`}
                  onChange={(event) =>
                    setSize(Number.parseInt(event.target.value))
                  }
                  value={size}
                >
                  {sizeOptions?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              )}
            </div>
          </div>
        </Col>
      )}
    </Row>
  );
}

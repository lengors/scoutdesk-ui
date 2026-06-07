import { useTranslation } from "react-i18next";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Col, Container, Row, Table } from "react-bootstrap";
import { StatusIndicator } from "../common/status-indicator";
import { PendingIndicator } from "../common/pending-indicator";
import { SpecificationTableEntry } from "./specification-table-entry";
import { specificationsQueryOptions } from "../../options/specifications/specification-query-options";

export function SpecificationTable() {
  const { t } = useTranslation();
  const { data, isLoading } = useSuspenseQuery(specificationsQueryOptions);

  if (isLoading || (data?.length ?? 0) === 0) {
    return (
      <Container fluid>
        <Row className="g-3">
          <Col xs={12}>
            {isLoading ? (
              <PendingIndicator>{t("specification.loading")}</PendingIndicator>
            ) : (
              <StatusIndicator>{t("specification.notFound")}</StatusIndicator>
            )}
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Table className="mb-0 text-nowrap" hover responsive striped>
      <thead>
        <tr>
          <th>{t("common.name")}</th>
          <th>{t("specification.status")}</th>
          <th>{t("common.actions")}</th>
        </tr>
      </thead>
      <tbody className="table-group-divider">
        {data?.map((name) => (
          <SpecificationTableEntry key={name} name={name} />
        ))}
      </tbody>
    </Table>
  );
}

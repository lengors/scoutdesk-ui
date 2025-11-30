import { useQuery } from "@tanstack/react-query";
import { Col, Container, Row, Table } from "react-bootstrap";
import { StatusIndicator } from "../common/status-indicator";
import { PendingIndicator } from "../common/pending-indicator";
import { SpecificationTableEntry } from "./specification-table-entry";
import { specificationsQueryOptions } from "../../options/specifications/specification-query-options";

export function SpecificationTable() {
  const { data, isLoading } = useQuery(specificationsQueryOptions);

  if (isLoading || (data?.length ?? 0) === 0) {
    return (
      <Container fluid>
        <Row className="g-3">
          <Col xsw={12}>
            {isLoading ? (
              <PendingIndicator>Loading specifications...</PendingIndicator>
            ) : (
              <StatusIndicator>No specifications found.</StatusIndicator>
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
          <th>Name</th>
          <th>Status</th>
          <th>Actions</th>
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

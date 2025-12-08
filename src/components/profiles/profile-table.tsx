import { useSuspenseQuery } from "@tanstack/react-query";
import { ProfileTableEntry } from "./profile-table-entry";
import { Col, Container, Row, Table } from "react-bootstrap";
import { StatusIndicator } from "../common/status-indicator";
import { PendingIndicator } from "../common/pending-indicator";
import { profilesQueryOptions } from "../../options/profiles/profile-query-options";

export function ProfileTable() {
  const { data, isLoading } = useSuspenseQuery(profilesQueryOptions);

  if (isLoading || (data?.length ?? 0) === 0) {
    return (
      <Container fluid>
        <Row className="g-3">
          <Col xs={12}>
            {isLoading ? (
              <PendingIndicator>Loading profiles...</PendingIndicator>
            ) : (
              <StatusIndicator>No profiles found.</StatusIndicator>
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
          <th>Specification</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody className="table-group-divider">
        {data?.map((name) => (
          <ProfileTableEntry key={name} name={name} />
        ))}
      </tbody>
    </Table>
  );
}

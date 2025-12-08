import { Trash3Fill } from "react-bootstrap-icons";
import { Card, Col, Container, Row } from "react-bootstrap";
import { CardPanel } from "../../components/common/card-panel";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { ProfileTable } from "../../components/profiles/profile-table";
import { ProfileEditor } from "../../components/profiles/profile-editor";
import { profilesQueryOptions } from "../../options/profiles/profile-query-options";
import { ConfirmationModalButton } from "../../components/common/confirmation-modal-button";
import { deleteProfileMutationOptions } from "../../options/profiles/profile-mutation-options";

export function Profiles() {
  const { data } = useSuspenseQuery(profilesQueryOptions);
  const deleteMutation = useMutation(deleteProfileMutationOptions);

  return (
    <Container>
      <Row className="align-self-start flex-grow-1 g-3 mb-3">
        <Col xs={12} />
        <Col className="order-lg-2" lg={5} xl={4} xs={12}>
          <Row className="g-3">
            <Col xs={12}>
              <CardPanel>
                <Row className="g-3">
                  <Col xs={12}>
                    <ProfileEditor />
                  </Col>
                </Row>
              </CardPanel>
            </Col>
          </Row>
        </Col>
        <Col lg={7} xl={8} xs={12}>
          <CardPanel>
            <Row className="g-3">
              <Col xs={12}>
                <Row className="g-3">
                  <Col xs={12}>
                    <Card.Title className="align-self-center d-flex mb-0 pb-3">
                      <span className="flex-grow-1 fs-3 h3 mb-0">Profiles</span>
                      <ConfirmationModalButton
                        disabled={(data?.length ?? 0) === 0}
                        message="Are you sure you want to delete all profiles?"
                        mutation={deleteMutation}
                        size="sm"
                        title="Delete profiles"
                        tooltip="Delete all profiles"
                        variables={undefined}
                        variant="outline-danger"
                      >
                        <Trash3Fill />
                      </ConfirmationModalButton>
                    </Card.Title>
                  </Col>
                </Row>
                <hr className="mb-3 mt-0" />
                <Row className="g-3">
                  <Col xs={12}>
                    <ProfileTable />
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardPanel>
        </Col>
      </Row>
    </Container>
  );
}

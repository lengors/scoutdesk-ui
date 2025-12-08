import { useForm } from "../../hooks/use-form";
import { Trash3Fill } from "react-bootstrap-icons";
import { CardPanel } from "../../components/common/card-panel";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { SubmitButton } from "../../components/common/submit-button";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { FieldControlled } from "../../components/common/field-controlled";
import { SpecificationTable } from "../../components/specifications/specification-table";
import { ConfirmationModalButton } from "../../components/common/confirmation-modal-button";
import { specificationsQueryOptions } from "../../options/specifications/specification-query-options";
import {
  deleteSpecificationMutationOptions,
  uploadSpecificationMutationOptions,
} from "../../options/specifications/specification-mutation-options";

export function Specifications() {
  const { data } = useSuspenseQuery(specificationsQueryOptions);
  const deleteMutation = useMutation(deleteSpecificationMutationOptions);
  const { mutateAsync } = useMutation(uploadSpecificationMutationOptions);
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<{
    specification: FileList | [File] | [];
  }>({
    defaultValues: {
      specification: [],
    },
    reValidateMode: "onSubmit",
  });

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
                    <Form
                      noValidate
                      onSubmit={handleSubmit(
                        async ({ specification }) =>
                          await mutateAsync(specification?.[0]),
                      )}
                    >
                      <Row className="g-3">
                        <Col xs={12}>
                          <Row className="g-3">
                            <Col xs={12}>
                              <FieldControlled
                                accept=".json, .yaml, .yml"
                                control={control}
                                label="Specification content"
                                name="specification"
                                type="file"
                              />
                            </Col>
                          </Row>
                          <hr className="my-3" />
                          <Row className="g-3 justify-content-end">
                            <Col lg={12} md={6} xs={12}>
                              <SubmitButton
                                className="w-100"
                                disabled={isSubmitting}
                              >
                                Save specification
                              </SubmitButton>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Form>
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
                      <span className="flex-grow-1 fs-3 h3 mb-0">
                        Specifications
                      </span>
                      <ConfirmationModalButton
                        disabled={(data?.length ?? 0) === 0}
                        message="Are you sure you want to delete all specifications?"
                        mutation={deleteMutation}
                        size="sm"
                        title="Delete specifications"
                        tooltip="Delete all specifications"
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
                    <SpecificationTable />
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

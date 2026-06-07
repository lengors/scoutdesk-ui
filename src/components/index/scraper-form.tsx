import type { UseFormReturn } from "react-hook-form";

import { Route } from "../../routes";
import { useTranslation } from "react-i18next";
import { useId, type ReactNode } from "react";
import { CardPanel } from "../common/card-panel";
import { Col, Form, Row } from "react-bootstrap";
import { SubmitButton } from "../common/submit-button";
import { FieldControlled } from "../common/field-controlled";

export interface ScraperFormProps {
  readonly children?: ReactNode;
  readonly form: Pick<
    UseFormReturn<{ readonly query: string }>,
    "control" | "formState" | "handleSubmit"
  >;
}

export function ScraperForm({
  children,
  form: {
    control,
    formState: { isDirty },
    handleSubmit,
  },
}: ScraperFormProps) {
  const { t } = useTranslation();
  const submitButtonId = useId();
  const navigator = Route.useNavigate();

  return (
    <CardPanel>
      <Row className="g-3">
        <Col xs={12}>
          <Form
            noValidate
            onSubmit={handleSubmit(async ({ query }) => {
              navigator({
                search: {
                  query,
                },
              });
            })}
          >
            <Row className="g-3">
              {children}
              <Col>
                <FieldControlled
                  control={control}
                  label={t("scraper.searchContent")}
                  name="query"
                  placeholder="2055516"
                  type="text"
                />
              </Col>
              <Col xs={12} sm="auto">
                <Form.Group>
                  <Form.Label
                    className="invisible d-none d-sm-inline-block"
                    htmlFor={submitButtonId}
                    style={{ whiteSpace: "pre" }}
                  >
                    {" "}
                  </Form.Label>
                  <Form.Control
                    as={SubmitButton}
                    disabled={!isDirty}
                    id={submitButtonId}
                    isLoading={false}
                  >
                    {t("scraper.search")}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </CardPanel>
  );
}

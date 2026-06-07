import type { UseFormReturn } from "react-hook-form";

import { ScraperForm } from "./scraper-form";
import { Col, Container, Row } from "react-bootstrap";

export interface ScraperPromptProps {
  readonly form: Pick<
    UseFormReturn<{ readonly query: string }>,
    "control" | "formState" | "handleSubmit"
  >;
}

export function ScraperPrompt({ form }: ScraperPromptProps) {
  return (
    <Container className="d-flex flex-fill" fluid="md">
      <Row className="align-self-center flex-grow-1 g-3 mb-3">
        <Col />
        <Col xs={12} lg={8}>
          <ScraperForm form={form} />
        </Col>
        <Col />
      </Row>
    </Container>
  );
}

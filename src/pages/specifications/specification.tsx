import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Route } from "../../routes/specifications.$name";
import { CardPanel } from "../../components/common/card-panel";
import { useThemeContext } from "../../hooks/use-theme-context";
import { userQueryOptions } from "../../options/users/user-query-options";
import { Breadcrumb, Button, Card, Col, Container, Row } from "react-bootstrap";
import { BreadcrumbItemLink } from "../../components/common/breadcrumb-item-link";
import { specificationQueryOptions } from "../../options/specifications/specification-query-options";
import {
  atomOneDarkReasonable,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

import SyntaxHighlighter from "react-syntax-highlighter";

import * as YAML from "yaml";

export function Specification() {
  const { name } = Route.useParams();
  const { theme } = useThemeContext();
  const {
    data: { username: owner },
  } = useSuspenseQuery(userQueryOptions);
  const {
    data: { specification },
  } = useSuspenseQuery(specificationQueryOptions({ name, owner }));

  const specificationYaml = useMemo(
    () => YAML.stringify(specification),
    [specification],
  );
  const specificationHref = useMemo(
    () => `data:text/yaml,${encodeURIComponent(specificationYaml)}`,
    [specificationYaml],
  );

  return (
    <Container>
      <Row className="align-self-start flex-grow-1 g-3 mb-3">
        <Col xs={12} />
        <Col xs={12}>
          <CardPanel
            footer={
              <div className="my-1">
                <Row className="g-3">
                  <Col />
                  <Col xs="auto">
                    <Button
                      as="a"
                      download={`${owner}_${name}.yaml`}
                      href={specificationHref}
                      role="button"
                      variant="outline-primary"
                    >
                      Download
                    </Button>
                  </Col>
                </Row>
              </div>
            }
          >
            <Row className="g-3">
              <Col xs={12}>
                <Card.Title className="align-self-center border-2 border-body border-bottom d-flex mb-0">
                  <Breadcrumb className="fs-3 h3 mb-0">
                    <BreadcrumbItemLink
                      activeOptions={{ exact: true }}
                      to="/specifications"
                    >
                      Specifications
                    </BreadcrumbItemLink>
                    <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                  </Breadcrumb>
                </Card.Title>
              </Col>
              <Col xs={12}>
                <SyntaxHighlighter
                  className="mb-0 p-3 rounded-3 shadow"
                  language="yaml"
                  showLineNumbers
                  style={
                    theme === "dark" ? atomOneDarkReasonable : atomOneLight
                  }
                  wrapLongLines
                >
                  {specificationYaml}
                </SyntaxHighlighter>
              </Col>
            </Row>
          </CardPanel>
        </Col>
      </Row>
    </Container>
  );
}

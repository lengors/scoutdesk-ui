import { useTranslation } from "react-i18next";
import { Route } from "../../routes/profiles.$name";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CardPanel } from "../../components/common/card-panel";
import { Breadcrumb, Card, Col, Container, Row } from "react-bootstrap";
import { ProfileEditor } from "../../components/profiles/profile-editor";
import { userQueryOptions } from "../../options/users/user-query-options";
import { BreadcrumbItemLink } from "../../components/common/breadcrumb-item-link";
import { profileQueryOptions } from "../../options/profiles/profile-query-options";

export function Profile() {
  const { t } = useTranslation();
  const { name } = Route.useParams();
  const { readOnly } = Route.useSearch();
  const {
    data: { username: owner },
  } = useSuspenseQuery(userQueryOptions);
  const {
    data: { specification: _ },
  } = useSuspenseQuery(profileQueryOptions({ name, owner }));

  return (
    <Container>
      <Row className="align-self-start flex-grow-1 g-3 mb-3">
        <Col xs={12} />
        <Col xs={12}>
          <CardPanel>
            <Row className="g-3">
              <Col xs={12}>
                <Row className="g-3">
                  <Col xs={12}>
                    <Card.Title className="align-self-center d-flex mb-0">
                      <Breadcrumb className="fs-3 h3 mb-0">
                        <BreadcrumbItemLink
                          activeOptions={{ exact: true }}
                          to="/profiles"
                        >
                          {t("profile.profiles")}
                        </BreadcrumbItemLink>
                        <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                      </Breadcrumb>
                    </Card.Title>
                  </Col>
                </Row>
                <hr className="mb-3 mt-0" />
                <Row className="g-3">
                  <Col xs={12}>
                    <ProfileEditor name={name} readOnly={readOnly} />
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

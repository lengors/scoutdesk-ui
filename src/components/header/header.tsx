import {
  BoxArrowLeft,
  BrightnessHighFill,
  CircleHalf,
  MoonStarsFill,
} from "react-bootstrap-icons";
import { HeaderLink } from "./header-link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TooltipButton } from "../common/tooltip-button";
import { useThemeContext } from "../../hooks/use-theme-context";
import { userQueryOptions } from "../../options/users/user-query-options";
import { Col, Container, Nav, Navbar, Offcanvas, Row } from "react-bootstrap";

import "./header.css";

import Logo from "../../assets/logo.svg";

export function Header() {
  const themeContext = useThemeContext();
  const { data } = useSuspenseQuery(userQueryOptions);
  const { theme, themePreference, togglePreference } = themeContext;

  return (
    <Navbar className="shadow" expand="lg">
      <Container fluid>
        <Navbar.Brand>
          <img
            alt="Scoutdesk"
            className="d-inline-block"
            height="50"
            src={Logo}
            width="50"
          />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="scoutdesk-navbar"
          aria-labelledby="scoutdesk-navbar-title"
        />
        <Navbar.Offcanvas id="scoutdesk-navbar" placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="scoutdesk-navbar-title">
              Scoutdesk
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column flex-lg-row">
            <Nav className="flex-grow-1 justify-content-start pe-3">
              <Nav.Item className="align-items-center d-flex">
                <HeaderLink to="/">Home</HeaderLink>
              </Nav.Item>
            </Nav>
            <Navbar.Text className="my-auto">
              <Container>
                <Row className="g-2">
                  <Col />
                  <Col xs="auto">
                    <TooltipButton
                      aria-label="Toggle theme"
                      className="rounded-circle"
                      onClick={togglePreference}
                      placement="auto-start"
                      size="sm"
                      tooltip="Toggle theme"
                      trigger={["focus", "hover"]}
                      variant={theme}
                    >
                      {
                        {
                          system: <CircleHalf />,
                          dark: <MoonStarsFill />,
                          light: <BrightnessHighFill />,
                        }[themePreference]
                      }
                    </TooltipButton>
                  </Col>
                  <Col xs="auto">
                    <TooltipButton
                      aria-label="Back to SSO"
                      className="rounded-circle"
                      placement="auto-start"
                      size="sm"
                      tooltip="Back to SSO"
                      trigger={["focus", "hover"]}
                      variant={theme}
                    >
                      <BoxArrowLeft />
                    </TooltipButton>
                  </Col>
                  <Col xs="auto">
                    <TooltipButton
                      aria-label="Open profile menu"
                      className="profile rounded-circle"
                      placement="auto-start"
                      style={{
                        backgroundImage: `url(${data?.avatar})`,
                      }}
                      tooltip={
                        <div className="p-1">
                          <Row>
                            <Col xs={12}>
                              <span>{data?.name}</span>
                              <br />
                              <span className="text-muted">
                                @{data?.username}
                              </span>
                            </Col>
                          </Row>
                        </div>
                      }
                      tooltipArrowClassName="d-none"
                      tooltipClassName="text-start"
                      trigger="focus"
                      variant="outline-secondary"
                    />
                  </Col>
                </Row>
              </Container>
            </Navbar.Text>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

import { Fragment } from "react";
import { Outlet } from "@tanstack/react-router";
import { Header } from "./components/header/header";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export function App() {
  return (
    <Fragment>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </Fragment>
  );
}

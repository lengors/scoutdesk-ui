import { render } from "@testing-library/react";
import { Root } from "../../../src/bootstrap/root";
import { createMemoryHistory } from "@tanstack/react-router";
import { createRouter } from "../../../src/bootstrap/router-provider";

export function renderRoute(route: string) {
  const history = createMemoryHistory({ initialEntries: [route] });
  const view = render(
    <Root
      router={createRouter({
        history,
      })}
    />,
  );

  return { ...view, history } as const;
}

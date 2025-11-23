import { StrictMode } from "react";
import { Container } from "react-bootstrap";
import { queryClient } from "./query-client-provider";
import { RouterProvider } from "@tanstack/react-router";
import { router as defaultRouter } from "./router-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../components/theme/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export interface RootProps {
  readonly router?: typeof defaultRouter;
}

export function Root({ router }: RootProps) {
  return (
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Container className="d-flex flex-column min-vh-100 px-0" fluid>
            <RouterProvider router={router ?? defaultRouter} />
          </Container>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

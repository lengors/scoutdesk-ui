// Vitest setup file for React + RTL
import "@testing-library/jest-dom";
import "./__mocks/containers/mock-server";
import "./__mocks/globals/mock-media-query-list";

// Ensure document has an html element attribute API applied during tests
document.documentElement.setAttribute("data-bs-theme", "light");

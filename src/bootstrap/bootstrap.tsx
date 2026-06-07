import { Root } from "./root";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");
if (rootElement?.innerHTML !== undefined) {
  createRoot(rootElement).render(<Root />);
}

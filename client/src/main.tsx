import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * React Application Entry Point.
 * Mounts the root component to the DOM.
 */

createRoot(document.getElementById("root")!).render(<App />);

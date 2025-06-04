import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import { scan } from "react-scan";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

if (import.meta.env.DEV) {
  scan({ enabled: true });
}

createRoot(root).render(
  <StrictMode>
    <Theme accentColor="blue" grayColor="slate" radius="medium" scaling="100%">
      <App />
    </Theme>
  </StrictMode>,
);

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { i18nReady } from "./i18n/config";
void i18nReady.then(() => createRoot(document.getElementById("root")!).render(<App />));

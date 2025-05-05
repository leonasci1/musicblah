// src/index.tsx

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setApiToken } from "@/services/api";

// 1. Recupera o token (se existir) e configura nos headers
const token = localStorage.getItem("token");
if (token) {
  setApiToken(token);
}

// 2. Monta o React no elemento root (única invocação)
const container = document.getElementById("root");
if (!container) {
  throw new Error("Elemento #root não encontrado no HTML");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

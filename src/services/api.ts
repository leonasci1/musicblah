// src/services/api.ts

import axios from "axios";

// Cria instância do Axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Seta o token no header
export function setApiToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// Interceptor para respostas
api.interceptors.response.use(
  response => response,
  error => {
    // Se o status for 401, token expirou ou é inválido
    if (error.response?.status === 401) {
      console.warn("Token expirado ou inválido. Redirecionando para login.");
      // Limpa o token
      localStorage.removeItem("token");
      setApiToken(null);
      // Redireciona para a página de login (ajuste conforme sua rota)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

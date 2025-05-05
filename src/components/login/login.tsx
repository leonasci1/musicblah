// src/components/LoginForm.jsx

import React, { useState } from "react";
import { api, setApiToken } from "@/services/api";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Faz login e obtém token
      const response = await api.post("/login", { username, password });
      const { token } = response.data;

      // Salva e configura o token para futuras solicitações
      localStorage.setItem("token", token);
      setApiToken(token);

      alert("Login realizado com sucesso!");
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      alert(
        err.response?.data?.error ||
        "Não foi possível fazer login. Verifique suas credenciais."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

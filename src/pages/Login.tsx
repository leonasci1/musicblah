// src/pages/Login.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { isAxiosError } from "axios";
import { api, setApiToken } from "@/services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Tentando login com email e senha...");
      const resp = await api.post<{ token: string; user?: { id: string; username: string } }>(
        "/login",
        { email, password }
      );

      console.log("Resposta do backend:", resp.data);

      const { token, user } = resp.data;

      // Verifica se o token e o usuário foram retornados corretamente
      if (!token || !user) {
        throw new Error("Resposta inválida do servidor. Verifique o backend.");
      }

      // Armazena o token e os dados do usuário no localStorage
      localStorage.setItem("token", token);
      setApiToken(token);

      // Salva o identificador do perfil no localStorage
      localStorage.setItem("profileId", user.username);

      // Redireciona para o perfil do usuário
      navigate(`/profile/${user.username}`);
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);

      if (isAxiosError(err) && err.response) {
        const { status, data } = err.response;
        switch (status) {
          case 400:
            setError(data.error || "Requisição inválida");
            break;
          case 401:
            setError("Email ou senha incorretos");
            break;
          case 500:
            setError("Erro interno no servidor. Tente mais tarde.");
            break;
          default:
            setError(data.error || "Erro desconhecido");
        }
      } else {
        setError("Não foi possível conectar ao servidor");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSpotifyLogin = () => {
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI ||
      "http://localhost:5000/auth/spotify";
    window.location.href = redirectUri;
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-neutral-950 to-neutral-900 text-gray-100">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <img
            src="símbolo roxo@3x.png"
            alt="Logo símbolo roxo"
            className="h-12 w-12 transition-transform duration-750 hover:scale-110 text-purple-500"
          />
          <h1 className="text-4xl font-bold text-purple-500">musicblah!</h1>
          <p className="text-gray-400">Entre na sua conta para continuar</p>
        </div>

        <Card className="w-full bg-neutral-950 border-none shadow-md transition-transform duration-200 hover:scale-105">
          <CardHeader>
            <CardTitle className="text-gray-100">Entrar</CardTitle>
            <CardDescription className="text-gray-400">
              Insira suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700 text-gray-100 placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">
                    Senha
                  </Label>
                  <Link to="/forgot-password" className="text-sm text-purple-500 hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-700 text-gray-100 placeholder-gray-400"
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-gray-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 flex items-center">
              <Separator className="flex-1 bg-gray-700" />
              <span className="mx-4 text-xs text-gray-400">OU</span>
              <Separator className="flex-1 bg-gray-700" />
            </div>

            <Button
              variant="outline"
              className="mt-4 w-full border-gray-700 text-gray-100 hover:bg-gray-700"
              onClick={handleSpotifyLogin}
            >
              <Music2 className="mr-2 h-4 w-4" />
              Continuar com Spotify
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-400">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-purple-500 hover:underline">
                Criar conta
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

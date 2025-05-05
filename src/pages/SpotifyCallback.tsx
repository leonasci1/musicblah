import { useEffect, useState } from 'react';
import { getTokenFromUrl, saveToken } from '@/services/spotify';
import { toast } from "@/components/ui/use-toast";

export default function SpotifyCallback() {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(true);

  useEffect(() => {
    const processAuthentication = async () => {
      try {
        setProcessing(true);
        console.log("Processando autenticação do Spotify...");
        console.log("URL atual:", window.location.href);

        // Verificar se há um erro nos parâmetros da URL
        const urlParams = new URLSearchParams(window.location.hash.substring(1)); // Corrigido para usar o hash
        const errorParam = urlParams.get('error');

        if (errorParam) {
          console.error("Erro retornado do Spotify:", errorParam);
          throw new Error(`Erro de autenticação do Spotify: ${errorParam}`);
        }

        // Extrair o token da URL usando a função melhorada
        const token = urlParams.get('access_token');
        console.log("Token extraído:", token ? "Token presente" : "Token ausente");

        if (token) {
          // Salvar o token
          saveToken(token);
          console.log("Token salvo com sucesso");

          toast({
            title: "Conectado ao Spotify",
            description: "Autenticação realizada com sucesso!",
          });

          // Redirecionar para a página principal
          setTimeout(() => {
            console.log("Redirecionando para a página principal...");
            window.location.href = '/';
          }, 2000);
        } else {
          console.error("Falha ao extrair token da URL");
          throw new Error("Não foi possível obter o token de acesso. Verifique o console para mais detalhes.");
        }
      } catch (e: unknown) {
        console.error("Exceção durante a autenticação:", e);
        if (e instanceof Error) {
          setError(e.message || "Erro no processamento da autenticação");
        } else {
          setError("Erro no processamento da autenticação");
        }

        toast({
          title: "Erro de Autenticação",
          description: e instanceof Error ? e.message : "Não foi possível conectar ao Spotify. Tente novamente.",
          variant: "destructive",
        });

        // Redirecionar após erro
        setTimeout(() => {
          console.log("Redirecionando para a página principal após erro...");
          window.location.href = '/';
        }, 3000);
      } finally {
        setProcessing(false);
      }
    };

    processAuthentication();
  }, []);

  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="mb-4 text-destructive">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold">Falha na Autenticação</h1>
            <p className="text-muted-foreground">{error}</p>
            <p className="mt-4 text-sm">Redirecionando para a página principal...</p>
          </>
        ) : (
          <>
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-music-purple border-t-transparent mx-auto"></div>
            <h1 className="text-2xl font-semibold">Conectando ao Spotify...</h1>
            <p className="text-muted-foreground">
              {processing 
                ? "Processando sua autenticação..." 
                : "Autenticação concluída! Você será redirecionado em instantes."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
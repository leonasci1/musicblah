import { useEffect, useState } from 'react';

// Configuração do Spotify
const CLIENT_ID = '5b8cd851163d46c5894d3e2de61063f6';
const REDIRECT_URI = window.location.origin + '/spotify-callback';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-recently-played'
].join(' '); // Usando espaço para facilitar a leitura, depois o encode será feito

// URL para iniciar o processo de autenticação
export const getAuthUrl = (): string => {
  return `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}` +
         `&response_type=token` +
         `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
         `&scope=${encodeURIComponent(SCOPES)}` +
         `&show_dialog=true`;
};

// Função para extrair o token de acesso da URL
export const getTokenFromUrl = (): string | null => {
  try {
    const hash = window.location.hash;
    console.log('Hash da URL:', hash);
    
    if (!hash || hash.length < 2) {
      console.log('Nenhum hash encontrado na URL');
      return null;
    }
    
    // Remove o '#' inicial e usa URLSearchParams para obter os parâmetros
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    
    console.log('Access token encontrado:', accessToken ? 'Sim' : 'Não');
    return accessToken;
  } catch (error) {
    console.error('Erro ao extrair token da URL:', error);
    return null;
  }
};

// Salvar o token no localStorage
export const saveToken = (token: string): void => {
  console.log('Salvando token no localStorage');
  localStorage.setItem('spotify_token', token);
  localStorage.setItem('spotify_token_timestamp', Date.now().toString());
  
  // Dispara evento personalizado para notificar outros componentes
  window.dispatchEvent(new Event('spotify_auth_changed'));
};

// Obter o token salvo
export const getToken = (): string | null => {
  const token = localStorage.getItem('spotify_token');
  const timestamp = localStorage.getItem('spotify_token_timestamp');
  
  // Verifica se o token expirou (1 hora = 3600000 ms)
  if (token && timestamp) {
    const now = Date.now();
    const tokenAge = now - parseInt(timestamp, 10);
    if (tokenAge > 3600000) {
      // Token expirado, remove e retorna null
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_token_timestamp');
      return null;
    }
    return token;
  }
  return null;
};

export default function useSpotifyAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  
  useEffect(() => {
    // Verifica se existe um token na URL e salva, caso exista.
    const tokenFromUrl = getTokenFromUrl();
    if (tokenFromUrl) {
      saveToken(tokenFromUrl);
      // Limpa o hash da URL para evitar reprocessamento
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }

    const token = getToken();
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login: () => {
      window.location.href = getAuthUrl();
    },
    logout: () => {
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_token_timestamp');
      window.dispatchEvent(new Event('spotify_auth_changed'));
      setIsAuthenticated(false);
    },
  };
}

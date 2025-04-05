import { useEffect, useState } from 'react';

// Authentication-related functions for Spotify

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
].join('%20');

// URL para iniciar o processo de autenticação
export const getAuthUrl = () => {
  return `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}&show_dialog=true`;
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
    
    // Remover o # inicial e dividir os parâmetros usando URLSearchParams
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
  
  // Disparar evento personalizado para notificar outros componentes
  window.dispatchEvent(new Event('spotify_auth_changed'));
};

// Obter o token salvo
export const getToken = (): string | null => {
  const token = localStorage.getItem('spotify_token');
  const timestamp = localStorage.getItem('spotify_token_timestamp');
  
  // Verificar se o token expirou (tokens do Spotify duram 1 hora = 3600000 ms)
  if (token && timestamp) {
    const now = Date.now();
    const tokenAge = now - parseInt(timestamp, 10);
    if (tokenAge > 3600000) {
      // Token expirado, remova e retorne null
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

  // Atualiza o estado de autenticação ao montar o hook
  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  return {
    isAuthenticated,
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

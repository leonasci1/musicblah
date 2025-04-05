import { getToken } from './auth';
import { getMockTopTracks } from './mock';
import { SpotifyTrack, SpotifyPlaylist } from './types';

// ID da playlist Global Top 50 do Spotify
const GLOBAL_TOP_50_PLAYLIST_ID = '37i9dQZEVXbMDoHDwVN2tF';

// Função auxiliar para fazer requisições à API do Spotify
export const fetchFromSpotify = async (endpoint: string): Promise<any> => {
  const token = getToken();
  if (!token) {
    throw new Error('No Spotify token available');
  }

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_token_timestamp');
      throw new Error('Spotify token expired');
    }
    throw new Error(`Spotify API error: ${response.status}`);
  }

  return response.json();
};

// Função para buscar as top músicas globais em tempo real do Spotify
export const fetchGlobalTopTracks = async (limit: number = 5): Promise<string[]> => {
  try {
    // Verificamos primeiro se temos um token
    const token = getToken();
    if (!token) {
      console.log('No Spotify token available, returning mock data');
      return getMockTopTracks();
    }

    // Buscar a playlist Global Top 50
    const data = await fetchFromSpotify(`/playlists/${GLOBAL_TOP_50_PLAYLIST_ID}`);
    
    // Extrair as tracks da resposta
    const topTracks = data.tracks.items
      .slice(0, limit)
      .map((item: any) => {
        const track = item.track;
        const artists = track.artists.map((artist: any) => artist.name).join(', ');
        return `${track.name} - ${artists}`;
      });
    
    return topTracks;
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    // Retornar dados simulados em caso de erro
    return getMockTopTracks();
  }
};

// Função para obter os dados detalhados das top músicas globais
export const fetchDetailedGlobalTopTracks = async (limit: number = 5): Promise<SpotifyTrack[]> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No Spotify token available');
    }

    // Buscar a playlist Global Top 50
    const data = await fetchFromSpotify(`/playlists/${GLOBAL_TOP_50_PLAYLIST_ID}`);
    
    // Extrair as tracks da resposta com dados detalhados
    return data.tracks.items.slice(0, limit).map((item: any) => item.track);
  } catch (error) {
    console.error('Error fetching detailed Spotify data:', error);
    throw error;
  }
};
// src/services/spotify.ts

// Tipos para os dados retornados pelo Spotify
export interface SpotifyTrack {
  id: string;
  name: string;
  preview_url?: string | null;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  external_urls: { spotify: string };
  position: number; // posição na lista
}

// Tipo para a resposta de /playlists/{id}/tracks
interface PlaylistTracksResponse {
  items: { track: SpotifyTrack }[];
}

// Configuração do Spotify
const CLIENT_ID = '5b8cd851163d46c5894d3e2de61063f6';
const REDIRECT_URI = `${window.location.origin}/spotify-callback`;
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-recently-played',
].join(' ');

// ID da playlist Global Top 50 do Spotify
const GLOBAL_TOP_50_PLAYLIST_ID = '0YkAl6EZ1v0vzbdKhPhPpp';

// URL para iniciar o processo de autenticação
export const getAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'token',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    show_dialog: 'true',
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log('URL de autenticação:', authUrl);
  return authUrl;
};

// Extrai o token de acesso da URL hash (implicit grant)
export const getTokenFromUrl = (): string | null => {
  const hash = window.location.hash;
  if (!hash.startsWith('#')) return null;

  const params = new URLSearchParams(hash.slice(1));
  const token = params.get('access_token');
  console.log('Token extraído da URL:', token);
  return token;
};

// Salvar e obter token do localStorage
export const saveToken = (token: string): void => {
  localStorage.setItem('spotify_token', token);
  localStorage.setItem('spotify_token_timestamp', Date.now().toString());
  window.dispatchEvent(new Event('spotify_auth_changed'));
};

export const getToken = (): string | null => {
  const token = localStorage.getItem('spotify_token');
  const ts = localStorage.getItem('spotify_token_timestamp');
  if (!token || !ts) return null;

  const age = Date.now() - parseInt(ts, 10);
  if (age > 3600_000) {
    console.warn('Token expirado');
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_token_timestamp');
    return null;
  }
  return token;
};

// Fetch genérico para a API do Spotify
const fetchFromSpotify = async (endpoint: string): Promise<any> => {
  const token = getToken();
  if (!token) throw new Error('No Spotify token available');

  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    if (res.status === 401) {
      // token inválido/expirado
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_token_timestamp');
      throw new Error('Spotify token expired');
    }
    const errJson = await res.json();
    throw new Error(`Spotify API error ${res.status}: ${errJson.error?.message}`);
  }

  return res.json();
};

// Busca as top tracks da playlist Global Top 50
export async function fetchGlobalTopTracks(limit: number): Promise<SpotifyTrack[]> {
  try {
    const data = (await fetchFromSpotify(
      `/playlists/${GLOBAL_TOP_50_PLAYLIST_ID}/tracks?limit=${limit}`
    )) as PlaylistTracksResponse;

    return data.items.map((item, idx) => ({
      ...item.track,
      preview_url: item.track.preview_url ?? null,
      position: idx + 1,
    }));
  } catch (err) {
    console.error('Erro ao buscar músicas do Spotify:', err);
    // Fallback para dados mock
    return getMockTopTracks().map((name, idx) => ({
      id: `mock-${idx}`,
      name,
      preview_url: null,
      artists: [{ name: 'Mock Artist' }],
      album: { name: 'Mock Album', images: [{ url: '' }] },
      external_urls: { spotify: '#' },
      position: idx + 1,
    }));
  }
}

// Dados simulados
function getMockTopTracks(): string[] {
  return [
    "Seven (feat. Latto) - Jung Kook, Latto",
    "Cruel Summer - Taylor Swift",
    "Paint The Town Red - Doja Cat",
    "LALA - Myke Towers",
    "Dance The Night - Dua Lipa",
    "Flowers - Miley Cyrus",
    "Columbia - Quevedo",
    "WHERE SHE GOES - Bad Bunny",
    "Sprinter - Dave, Central Cee",
    "As It Was - Harry Styles"
  ];
}

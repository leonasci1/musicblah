// Tipos para os dados retornados pelo Spotify
export interface SpotifyTrack {
  id: string;
  name: string;
  preview_url?: string;
  artists: {
    name: string;
  }[];
  album: {
    name: string;
    images: {
      url: string;
    }[];
  };
  external_urls: {
    spotify: string;
  };
  position: number; // Adicionado para incluir a posição
}

export interface SpotifyPlaylist {
  tracks: {
    items: {
      track: SpotifyTrack;
    }[];
  };
}

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

// ID da playlist Global Top 50 do Spotify
const GLOBAL_TOP_50_PLAYLIST_ID = '0YkAl6EZ1v0vzbdKhPhPpp'; // ID correto para Global Top 50

// URL para iniciar o processo de autenticação
export const getAuthUrl = () => {
  return `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${SCOPES}&show_dialog=true`;
};

// Função para extrair o token de acesso da URL
export const getTokenFromUrl = (): string | null => {
  try {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) {
      return null;
    }
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    console.log('Token extraído da URL:', token);
    return token;
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
  window.dispatchEvent(new Event('spotify_auth_changed'));
};

// Obter o token salvo
export const getToken = (): string | null => {
  const token = localStorage.getItem('spotify_token');
  const timestamp = localStorage.getItem('spotify_token_timestamp');
  if (token && timestamp) {
    const now = Date.now();
    const tokenAge = now - parseInt(timestamp, 10);
    if (tokenAge > 3600000) {
      console.warn('Token expirado, removendo do localStorage');
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_token_timestamp');
      return null;
    }
    return token;
  }
  return null;
};

// Função auxiliar para fazer requisições à API do Spotify
const fetchFromSpotify = async (endpoint: string): Promise<any> => {
  const token = getToken();
  if (!token) {
    throw new Error('No Spotify token available');
  }

  console.log('Fazendo requisição para o endpoint:', endpoint);

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.warn('Token inválido ou expirado, removendo do localStorage');
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_token_timestamp');
      throw new Error('Spotify token expired');
    }
    const errorData = await response.json();
    console.error('Erro na API do Spotify:', errorData);
    throw new Error(`Spotify API error: ${response.status} - ${errorData.error.message}`);
  }

  return response.json();
};

// Função para buscar as top músicas globais em tempo real do Spotify
export async function fetchGlobalTopTracks(limit: number): Promise<SpotifyTrack[]> {
  try {
    const data = await fetchFromSpotify(`/playlists/${GLOBAL_TOP_50_PLAYLIST_ID}/tracks?limit=${limit}`);
    if (!data.items) {
      console.error('Estrutura inesperada na resposta da API:', data);
      return [];
    }

    // Mapeia os dados para incluir posição, nome, capa do álbum e artista
    return data.items.map((item: any, index: number) => ({
      id: item.track.id,
      name: item.track.name,
      preview_url: item.track.preview_url || null, // Permite null para músicas sem prévia
      artists: item.track.artists.map((artist: any) => ({ name: artist.name })),
      album: {
        name: item.track.album.name,
        images: item.track.album.images.map((image: any) => ({ url: image.url })),
      },
      external_urls: {
        spotify: item.track.external_urls.spotify,
      },
      position: index + 1,
    }));
  } catch (error) {
    console.error('Erro ao buscar músicas do Spotify:', error);
    return getMockTopTracks().map((track, index) => ({
      id: `mock-${index}`,
      name: track,
      preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // URL alternativa para simulação
      artists: [{ name: 'Mock Artist' }],
      album: { name: 'Mock Album', images: [{ url: '' }] },
      external_urls: { spotify: '#' },
      position: index + 1,
    }));
  }
}

// Dados simulados para quando não há token ou ocorre um erro
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
// Tipos para os dados retornados pelo iTunes
export interface iTunesTrack {
    trackId: number;
    trackName: string;
    artistName: string;
    collectionName: string;
    artworkUrl100: string;
    previewUrl: string;
  }
  
  // Função auxiliar para fazer requisições à API do iTunes
  const fetchFromiTunes = async (endpoint: string): Promise<any> => {
    const response = await fetch(`https://itunes.apple.com${endpoint}`);
    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }
    return response.json();
  };
  
  // Função para buscar as top músicas do iTunes
  export const fetchGlobalTopTracks = async (limit: number = 5): Promise<iTunesTrack[]> => {
    try {
      const data = await fetchFromiTunes(`/search?term=top&media=music&entity=musicTrack&limit=${limit}`);
      const topTracks = data.results.map((item: any) => ({
        trackId: item.trackId,
        trackName: item.trackName,
        artistName: item.artistName,
        collectionName: item.collectionName,
        artworkUrl100: item.artworkUrl100,
        previewUrl: item.previewUrl,
      }));
      return topTracks;
    } catch (error) {
      console.error('Error fetching iTunes data:', error);
      return [];
    }
  };
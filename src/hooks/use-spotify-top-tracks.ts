import { useState, useEffect, useCallback } from 'react';
import { fetchGlobalTopTracks, getToken, SpotifyTrack } from '@/services/spotify';
import { toast } from "@/components/ui/use-toast";

export function useSpotifyTopTracks(refreshInterval: number = 60000) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState<boolean>(false);

  // Verificar se o usuário está conectado ao Spotify
  useEffect(() => {
    const token = getToken();
    setIsSpotifyConnected(!!token);
    if (!token) {
      console.warn('Token não encontrado. O usuário não está conectado ao Spotify.');
    }
  }, []);

  const refreshTracks = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Atualizando as músicas do Spotify...');
      const topTracks = await fetchGlobalTopTracks(5); // Certifique-se de que retorna SpotifyTrack[]
      console.log('Músicas carregadas:', topTracks);
      setTracks(topTracks);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar músicas do Spotify:', err.message || err);
      setError('Falha ao carregar músicas do Spotify');
      toast({
        title: "Erro",
        description: err.message || "Não foi possível atualizar as top músicas globais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Carregar dados inicialmente
    refreshTracks();

    // Configurar atualização periódica
    const intervalId = setInterval(() => {
      console.log('Atualizando músicas periodicamente...');
      refreshTracks();
    }, refreshInterval);

    // Limpar o intervalo quando o componente for desmontado
    return () => {
      clearInterval(intervalId);
      console.log('Intervalo de atualização limpo.');
    };
  }, [refreshInterval, refreshTracks]);

  if (process.env.NODE_ENV === 'development') {
    console.log("Dados do Spotify:", tracks);
  }

  return { 
    tracks, 
    loading, 
    error, 
    lastUpdated, 
    refreshTracks,
    isSpotifyConnected
  };
}
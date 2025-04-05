import { useState, useEffect, useCallback } from 'react';
import { fetchGlobalTopTracks } from '@/services/itunes';
import { toast } from "@/components/ui/use-toast";

// Define the iTunesTrack type
type iTunesTrack = {
  trackName: string;
  artistName: string;
  albumName?: string;
  releaseDate?: string;
};

export function useITunesTopTracks(refreshInterval: number = 60000) {
  const [tracks, setTracks] = useState<iTunesTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshTracks = useCallback(async () => {
    try {
      setLoading(true);
      const topTracks = await fetchGlobalTopTracks(5);
      setTracks(topTracks);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Falha ao carregar músicas do iTunes');
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as top músicas globais",
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
    const intervalId = setInterval(refreshTracks, refreshInterval);

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [refreshInterval, refreshTracks]);

  return { 
    tracks, 
    loading, 
    error, 
    lastUpdated, 
    refreshTracks
  };
}
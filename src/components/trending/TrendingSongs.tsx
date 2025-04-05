import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useSpotifyTopTracks } from "@/hooks/use-spotify-top-tracks";
import { Button } from "@/components/ui/button";
import { RefreshCw, Music, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import useSpotifyAuth from "@/hooks/use-spotify-auth";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { SpotifyTrack } from "@/services/spotify";

export function TrendingSongs() {
  const { tracks, loading, lastUpdated, refreshTracks } = useSpotifyTopTracks(300000);
  const { isAuthenticated, login, logout } = useSpotifyAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Garante que sempre teremos um array para evitar erros de .map()
  const safeTracks: SpotifyTrack[] = Array.isArray(tracks) ? tracks : [];
  console.log("URL do áudio atual:", safeTracks[currentTrackIndex]?.preview_url);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshTracks();
    } catch (error) {
      console.error("Erro ao atualizar as músicas:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return "";
    return `Atualizado ${lastUpdated.toLocaleTimeString()}`;
  };

  const handleSpotifyAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login();
    }
  };

  const handleClickPrevious = () => {
    if (safeTracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + safeTracks.length) % safeTracks.length);
  };

  const handleClickNext = () => {
    if (safeTracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % safeTracks.length);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Músicas em Alta</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", (loading || isRefreshing) && "animate-spin")} />
            <span className="sr-only">Atualizar</span>
          </Button>
          <Button
            variant={isAuthenticated ? "outline" : "default"}
            size="sm"
            className={cn("h-8 text-xs", !isAuthenticated && "bg-[#1DB954] hover:bg-[#1DB954]/90")}
            onClick={handleSpotifyAction}
          >
            <Music2 className="mr-1 h-3 w-3" />
            {isAuthenticated ? "Desconectar" : "Conectar Spotify"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={`skeleton-${i}`} className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
          </div>
        ) : safeTracks.length === 0 ? (
          <p className="text-center text-sm">Nenhuma música encontrada.</p>
        ) : (
          <div>
            <ul className="space-y-2">
              {safeTracks.map((track, index) => (
                <li
                  key={`${track.id}-${index}`}
                  className={cn(
                    "flex items-center gap-2 rounded-md p-2 transition-colors cursor-pointer",
                    index === currentTrackIndex ? "bg-accent" : "hover:bg-accent"
                  )}
                  onClick={() => setCurrentTrackIndex(index)}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-music-purple/10 text-music-purple text-xs font-medium">
                    {index + 1}
                  </div>
                  <Music className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">
                    {track.name} - {track.artists?.map((artist) => artist.name).join(", ")}
                  </span>
                </li>
              ))}
            </ul>
            <AudioPlayer
             autoPlay
              src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
              onPlay={() => console.log("Reproduzindo música")}
              showSkipControls
              showJumpControls={false}
              onClickPrevious={handleClickPrevious}
              onClickNext={handleClickNext}
              header="Reproduzindo agora: Música de Teste"
            />
            {!safeTracks[currentTrackIndex]?.preview_url && (
              <p className="text-xs text-red-500 mt-2 italic">
                Esta música não possui prévia disponível no Spotify.
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">
          {formatLastUpdated()} •{" "}
          {isAuthenticated
            ? "Spotify Global Top 50 (dados reais)"
            : "Spotify Global Top 50 (simulado)"}
        </p>
      </CardFooter>
    </Card>
  );
}

export default TrendingSongs;
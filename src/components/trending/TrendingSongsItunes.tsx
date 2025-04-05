import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useiTunesTopTracks } from "@/hooks/use-itunes-top-tracks";
import { Button } from "@/components/ui/button";
import { RefreshCw, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useSpotifyAuth } from "@/hooks/use-spotify-auth";

export function TrendingSongs() {
  const { tracks, loading, lastUpdated, refreshTracks } = useiTunesTopTracks(300000);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTracks();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return "";
    return `Atualizado ${lastUpdated.toLocaleTimeString()}`;
  };

  const handleClickPrevious = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length);
  };

  const handleClickNext = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
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
            <RefreshCw 
              className={cn(
                "h-4 w-4", 
                (loading || isRefreshing) && "animate-spin"
              )} 
            />
            <span className="sr-only">Atualizar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <ul className="space-y-2">
              {tracks.map((track, index) => (
                <li 
                  key={index} 
                  className={cn(
                    "flex items-center gap-2 rounded-md p-2 transition-colors",
                    index === currentTrackIndex ? "bg-accent" : "hover:bg-accent"
                  )}
                  onClick={() => setCurrentTrackIndex(index)}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-music-purple/10 text-music-purple text-xs font-medium">
                    {index + 1}
                  </div>
                  <Music className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{track.trackName} - {track.artistName}</span>
                </li>
              ))}
            </ul>
            <AudioPlayer
              autoPlay
              src={tracks[currentTrackIndex]?.previewUrl}
              onPlay={() => console.log("onPlay")}
              showSkipControls
              showJumpControls={false}
              onClickPrevious={handleClickPrevious}
              onClickNext={handleClickNext}
              header={`Reproduzindo agora: ${tracks[currentTrackIndex]?.trackName} - ${tracks[currentTrackIndex]?.artistName}`}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">
          {formatLastUpdated()} • iTunes Top Tracks
        </p>
      </CardFooter>
    </Card>
  );
}
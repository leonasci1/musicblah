
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface NowPlayingProps {
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  music: {
    title: string;
    artist: string;
    album: string;
    cover: string;
    duration: string;
    progress: number;
  };
}

export function NowPlaying({ user, music }: NowPlayingProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="rounded-lg border bg-gradient-to-br from-music-dark/10 via-music-light/20 to-music-purple/10 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-music-purple animate-pulse-subtle">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="text-sm font-medium">
            <span className="text-music-purple">♪</span> {user.name} está ouvindo...
          </div>
          <div className="text-xs text-muted-foreground">
            há 2 minutos
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex gap-4">
        <img
          src={music.cover}
          alt={`${music.album} cover`}
          className="h-24 w-24 rounded-md shadow-md animate-float"
        />
        <div className="flex flex-col justify-between py-1">
          <div>
            <div className="font-medium leading-tight">{music.title}</div>
            <div className="text-sm text-muted-foreground">{music.artist}</div>
            <div className="text-xs text-muted-foreground">{music.album}</div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full music-gradient"
                style={{ width: `${music.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatProgress(music.progress, music.duration)}</span>
              <span>{music.duration}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1 text-sm text-muted-foreground",
            liked && "text-music-pink"
          )}
          onClick={() => setLiked(!liked)}
        >
          <Heart
            className={cn("h-4 w-4", liked && "fill-music-pink text-music-pink")}
          />
          <span>{liked ? "Curtido" : "Curtir"}</span>
        </Button>
      </div>
    </div>
  );
}

function formatProgress(progress: number, duration: string): string {
  // Fake calculation based on percentage and duration
  const [mins, secs] = duration.split(":").map(Number);
  const totalSeconds = mins * 60 + secs;
  const currentSeconds = Math.floor((totalSeconds * progress) / 100);
  const currentMins = Math.floor(currentSeconds / 60);
  const currentSecs = currentSeconds % 60;
  return `${currentMins}:${currentSecs.toString().padStart(2, "0")}`;
}

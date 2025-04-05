import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";

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
    duration: string; // formato "mm:ss"
    progress: number;
    postDate: string; // data válida (ex: ISO string)
  };
}

export function NowPlaying({ user, music }: NowPlayingProps) {
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0); // Inicializa o progresso com 0
  const [timeAgo, setTimeAgo] = useState("");
  const intervalRef = useRef<number | null>(null); // Usamos useRef para o intervalId

  // Atualiza o progresso da música a cada segundo usando update funcional
  useEffect(() => {
    const durationParts = music.duration.split(":");
    const durationMinutes = parseInt(durationParts[0], 10);
    const durationSeconds = parseInt(durationParts[1], 10);
    const totalDuration = durationMinutes * 60 + durationSeconds;

    // Limpa o intervalo anterior se existir
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Define um novo intervalo
    intervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 100 / totalDuration;
        if (newProgress >= 100) {
          clearInterval(intervalRef.current);
          intervalRef.current = null; // Limpa a referência
          return 100;
        }
        return newProgress;
      });
    }, 1000) as any; // Casting para 'any' para evitar erro de tipo

    // Função de limpeza para limpar o intervalo quando o componente é desmontado ou quando a duração da música muda
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [music.duration]);

  // Atualiza o tempo decorrido desde o post (timeAgo) a cada segundo
  useEffect(() => {
    const parsedPostDate = moment(music.postDate);
    if (!parsedPostDate.isValid()) {
      setTimeAgo("Data inválida");
      return;
    }

    const updateTimeAgo = () => {
      const newDiff = moment().diff(parsedPostDate, "minutes");
      const newTimeAgo =
        newDiff === 0
          ? "agora"
          : newDiff === 1
          ? "há 1 minuto"
          : `há ${newDiff} minutos`;
      setTimeAgo(newTimeAgo);
    };

    updateTimeAgo(); // atualização inicial
    const intervalId = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(intervalId);
  }, [music.postDate]);

  // Calcula o tempo atual do progresso
  const calculateProgress = () => {
    const durationParts = music.duration.split(":");
    const durationMinutes = parseInt(durationParts[0], 10);
    const durationSeconds = parseInt(durationParts[1], 10);
    const totalDuration = durationMinutes * 60 + durationSeconds;

    const currentTimeInSeconds = (progress / 100) * totalDuration;
    const currentMinutes = Math.floor(currentTimeInSeconds / 60);
    const currentSeconds = Math.floor(currentTimeInSeconds % 60);

    return `${currentMinutes}:${currentSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-lg border bg-gradient-to-br from-music-dark/10 via-music-light/20 to-music-purple/10 p-4 shadow-sm">
      <div className="flex items-center gap-3 bg-background-secondary">
        <Avatar className="h-10 w-10 border-2 border-music-purple animate-pulse-subtle">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="text-sm font-medium">
            <span className="text-music-purple">♪</span> {user.name} está ouvindo...
          </div>
          <div className="text-xs text-muted-foreground">{timeAgo}</div>
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
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{calculateProgress()}</span>
              <span>{music.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
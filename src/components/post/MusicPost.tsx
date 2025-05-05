// src/components/post/MusicPost.tsx

import { useState } from "react";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import { RiChatDeleteFill } from "react-icons/ri";

interface MusicPostProps {
  user: {
    name?: string;
    username?: string;
    avatar?: string;
    id?: string;
  };
  postId: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  music?: {
    title: string;
    artist: string;
    album: string;
    cover: string;
  };
  onDeleted?: () => void; // Callback para atualizar o feed após exclusão
}

export function MusicPost({
  postId,
  user,
  content,
  timestamp,
  likes: initialLikes,
  comments,
  music,
  onDeleted,
}: MusicPostProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
  };

  const handleDelete = async () => {
    if (!confirm("Deseja mesmo excluir este post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      alert("Post excluído com sucesso!");
      if (onDeleted) onDeleted(); // Chama o callback para atualizar o feed
    } catch (err: any) {
      console.error("Erro ao excluir:", err);
      alert(err.response?.data?.error || "Não foi possível excluir");
    }
  };

  // Determina o nome de exibição
  const displayName = user.name?.trim() || user.username?.trim() || "Usuário";
  const initial = displayName.charAt(0).toUpperCase();

  // Formata o timestamp
  let formattedTime = "";
  try {
    const date = new Date(timestamp);
    formattedTime = isNaN(date.getTime()) ? timestamp : date.toLocaleString();
  } catch {
    formattedTime = timestamp;
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm music-card-hover">
      <div className="flex gap-3">
        <Avatar>
          {user.avatar ? (
            <AvatarImage src={user.avatar} alt={displayName || "Avatar"} />
          ) : null}
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{displayName}</div>
          {user.username && (
            <div className="text-sm text-muted-foreground">
              @{user.username}
            </div>
          )}
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          {formattedTime}
        </div>
      </div>

      <div className="mt-4 text-sm whitespace-pre-wrap">{content}</div>

      {music && (
        <div className="mt-4 flex gap-3 rounded-md border bg-muted/50 p-3">
          <img
            src={music.cover}
            alt={`${music.album} cover`}
            className="h-16 w-16 rounded shadow"
          />
          <div className="flex flex-col justify-center">
            <div className="font-medium">{music.title}</div>
            <div className="text-sm text-muted-foreground">{music.artist}</div>
            <div className="text-xs text-muted-foreground">{music.album}</div>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex gap-1",
            liked ? "text-music-pink" : "text-muted-foreground"
          )}
          onClick={handleLike}
        >
          <Heart
            className={cn("h-4 w-4", liked && "fill-music-pink text-music-pink")}
          />
          <span>{likes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-1 text-muted-foreground"
        >
          <MessageSquare className="h-4 w-4" />
          <span>{comments}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-1 text-muted-foreground"
        >
          <Share2 className="h-4 w-4" />
        </Button>

        {user.id === api.currentUser?.id && (
        <Button
          variant="destructive"
          size="sm"
          className="flex gap-1 text-muted-foreground ml-auto bg-white/10 hover:bg-white/20 bg-transparent"
          onClick={handleDelete}
        >
          <RiChatDeleteFill
            size={16}
            className="h-4 w-4"
            
          />
          Excluir
        </Button>
      )}
     
      </div>

    </div>
  );
}


import { useState } from "react";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MusicPostProps {
  user: {
    name: string;
    username: string;
    avatar: string;
  };
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
}

export function MusicPost({
  user,
  content,
  timestamp,
  likes: initialLikes,
  comments,
  music,
}: MusicPostProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm music-card-hover">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">@{user.username}</div>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">{timestamp}</div>
      </div>
      
      <div className="mt-4 text-sm">{content}</div>
      
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
          <Button size="icon" variant="ghost" className="ml-auto h-8 w-8 self-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </Button>
        </div>
      )}
      
      <div className="mt-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex gap-1 text-muted-foreground",
            liked && "text-music-pink"
          )}
          onClick={handleLike}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-music-pink text-music-pink")} />
          <span>{likes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex gap-1 text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>{comments}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex gap-1 text-muted-foreground">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

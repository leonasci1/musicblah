
import { Button } from "@/components/ui/button";
import { Headphones, Settings, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  user: {
    name: string;
    username: string;
    avatar: string;
    coverImage: string;
    bio: string;
    followers: number;
    following: number;
    isCurrentUser?: boolean;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border bg-card shadow-sm">
      <div 
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${user.coverImage})` }}
      />
      
      <div className="relative px-6 pb-6">
        <Avatar className="absolute -top-12 h-24 w-24 border-4 border-background">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="mt-14 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          
          {user.isCurrentUser ? (
            <Button variant="outline" className="mt-3 md:mt-0">
              <Settings className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          ) : (
            <Button className="mt-3 md:mt-0 music-gradient">
              <Users className="mr-2 h-4 w-4" />
              Seguir
            </Button>
          )}
        </div>
        
        <p className="mt-3 text-sm">{user.bio}</p>
        
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-bold">{user.followers}</span>
            <span className="text-muted-foreground">seguidores</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{user.following}</span>
            <span className="text-muted-foreground">seguindo</span>
          </div>
          <div className="flex items-center gap-1">
            <Headphones className="h-4 w-4 text-music-purple" />
            <span className="text-muted-foreground">435 músicas ouvidas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

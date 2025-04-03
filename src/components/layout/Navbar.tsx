
import { Link } from "react-router-dom";
import { Bell, Music, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Music className="h-6 w-6 text-music-purple" />
            <span className="text-xl font-bold music-text-gradient">MusicBlah!</span>
          </Link>
        </div>
        
        <div className="hidden md:flex w-full max-w-sm items-center mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar músicas ou pessoas..."
              className="w-full pl-8 bg-muted/40"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-music-purple text-[10px] text-white">
              3
            </span>
          </Button>
          
          <Link to="/profile" className="ml-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>UM</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}

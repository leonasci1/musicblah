
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  User, 
  Headphones, 
  Music, 
  Heart, 
  ListMusic, 
  Users, 
  PlusCircle 
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Início", href: "/" },
  { icon: User, label: "Perfil", href: "/profile" },
  { icon: Headphones, label: "Ouvindo Agora", href: "/listening" },
  { icon: Music, label: "Descobrir", href: "/discover" },
  { icon: Heart, label: "Favoritos", href: "/favorites" },
  { icon: ListMusic, label: "Playlists", href: "/playlists" },
  { icon: Users, label: "Amigos", href: "/friends" },
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-background h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex flex-col gap-1 p-4">
        <Button 
          variant="default" 
          className="w-full justify-start gap-2 mb-4 music-gradient text-white"
        >
          <PlusCircle className="h-4 w-4" />
          Novo Post
        </Button>
        
        {sidebarItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                location.pathname === item.href && "bg-accent text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
      
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Headphones className="h-4 w-4 text-music-purple animate-pulse-subtle" />
          <span>Ouvindo agora:</span>
        </div>
        <div className="mt-2 text-sm font-medium">The Weeknd - Blinding Lights</div>
      </div>
    </aside>
  );
}

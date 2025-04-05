
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaRecordVinyl } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { LuUserRound } from "react-icons/lu";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiCompassDiscoverFill } from "react-icons/ri";
import { RiHeadphoneFill } from "react-icons/ri";
import { BsHeart } from "react-icons/bs";
import { LiaUserFriendsSolid } from "react-icons/lia";
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
  { icon: GoHomeFill, label: "Início", href: "/" },
  { icon: LuUserRound, label: "Perfil", href: "/profile" },
  { icon: RiHeadphoneFill, label: "Ouvindo Agora", href: "/listening" },
  { icon: RiCompassDiscoverFill, label: "Descobrir", href: "/discover" },
  { icon: BsHeart, label: "Favoritos", href: "/favorites" },
  { icon: ListMusic, label: "Playlists", href: "/playlists" },
  { icon: LiaUserFriendsSolid, label: "Amigos", href: "/friends" },
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-background h-[calc(100vh-4rem)] sticky top-16 dark theme">
      <div className="flex flex-col gap-1 p-4">
        <Button 
          variant="default" 
          className="w-full justify-start gap-2 mb-4 music-gradient text-white"
        >
          <FaRecordVinyl className="h-4 w-4" />
          Postar
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
        <div className="mt-2 text-sm font-medium">Fresno, Nx Zero - Se Eu For Eu Vou Com Você</div>
      </div>
    </aside>
  );
}
